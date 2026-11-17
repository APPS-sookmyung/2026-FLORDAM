// 농촌진흥청 국립원예특작과학원 「오늘의 꽃 조회 서비스(2.0)」 데이터를
// 한 번에 내려받아 src/data/flowers.json 으로 저장하는 스크립트
//
// 실행 (프로젝트 루트에서):
//   npm install -D fast-xml-parser
//   node --env-file=.env scripts/fetch-flowers.mjs
//
// .env 파일에 아래 한 줄이 있어야 해요 (이 파일은 GitHub에 올리면 안 돼요!)
//   FLOWER_API_KEY=발급받은_인증키

import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { dirname } from 'node:path'
import { XMLParser } from 'fast-xml-parser'

const ENDPOINT =
  'https://apis.data.go.kr/1390804/NihhsTodayFlowerInfo01/selectTodayFlowerView01'
const OUT_FILE = 'src/data/flowers.json'
const TOTAL = 366 // 1월 1일 ~ 12월 31일 (윤년 포함)
const DELAY_MS = 200 // 초당 호출 제한을 피하려고 사이사이 쉬어요
const MAX_RETRIES = 3
const MAX_CONSECUTIVE_FAILS = 5

// ---------- 인증키 준비 ----------
const rawKey = process.env.FLOWER_API_KEY
if (!rawKey) {
  console.error('FLOWER_API_KEY 가 없어요. .env 파일을 확인하세요.')
  process.exit(1)
}
// Encoding 키(%가 들어있는 키)를 넣어도 되도록 한 번 풀어줘요
let serviceKey = rawKey.trim()
try {
  serviceKey = decodeURIComponent(serviceKey)
} catch {
  /* 이미 디코딩된 키면 그대로 사용 */
}

const parser = new XMLParser({ parseTagValue: false, trimValues: true })

// ---------- 유틸 ----------
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

const clean = (v) =>
  v == null ? '' : String(v).replace(/\s+/g, ' ').trim()

// 응답 구조가 어떻든 flowNm 을 가진 객체를 찾아요
function findItem(node) {
  if (node && typeof node === 'object') {
    if ('flowNm' in node) return node
    for (const child of Object.values(node)) {
      const found = findItem(child)
      if (found) return found
    }
  }
  return null
}

// 이미지가 http:// 로 오는데, https 사이트(Netlify)에서는 막히므로 https 로 바꿔요
const toHttps = (url) => clean(url).replace(/^http:\/\//i, 'https://')

async function fetchOne(dataNo) {
  const url = `${ENDPOINT}?ServiceKey=${encodeURIComponent(serviceKey)}&dataNo=${dataNo}`
  let lastError

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const res = await fetch(url)
      const text = await res.text()
      if (!res.ok) throw new Error(`HTTP ${res.status} ${text.slice(0, 200)}`)

      const item = findItem(parser.parse(text))
      if (!item) throw new Error(`꽃 데이터를 찾지 못했어요: ${text.slice(0, 300)}`)
      return item
    } catch (err) {
      lastError = err
      await sleep(DELAY_MS * attempt * 3)
    }
  }
  throw lastError
}

function toFlower(item, dataNo) {
  return {
    id: `flower-${String(dataNo).padStart(3, '0')}`,
    dataNo,
    month: Number(item.fMonth) || null,
    day: Number(item.fDay) || null,
    name: clean(item.flowNm),
    scientificName: clean(item.fSctNm),
    englishName: clean(item.fEngNm),
    meaning: clean(item.flowLang), // 꽃말
    description: clean(item.fContent), // 내용
    usage: clean(item.fUse), // 이용
    care: clean(item.fGrow), // 기르기
    habitat: clean(item.fType), // 자생지
    images: [item.imgUrl1, item.imgUrl2, item.imgUrl3].map(toHttps).filter(Boolean),
    source: clean(item.publishOrg) || '농촌진흥청 국립원예특작과학원',
  }
}

async function save(flowers) {
  await mkdir(dirname(OUT_FILE), { recursive: true })
  const sorted = [...flowers].sort((a, b) => a.dataNo - b.dataNo)
  await writeFile(OUT_FILE, JSON.stringify(sorted, null, 2), 'utf8')
}

// ---------- 메인 ----------
async function main() {
  // 이미 받아둔 데이터가 있으면 이어서 받아요 (호출 횟수 절약)
  let flowers = []
  try {
    flowers = JSON.parse(await readFile(OUT_FILE, 'utf8'))
    console.log(`기존 데이터 ${flowers.length}개를 불러왔어요. 없는 것만 받을게요.`)
  } catch {
    /* 처음 실행이면 파일이 없어요 */
  }
  const done = new Set(flowers.map((f) => f.dataNo))

  let consecutiveFails = 0
  const failed = []

  for (let no = 1; no <= TOTAL; no++) {
    if (done.has(no)) continue

    try {
      const item = await fetchOne(no)
      flowers.push(toFlower(item, no))
      consecutiveFails = 0
      console.log(`[${no}/${TOTAL}] ${clean(item.flowNm)}`)
    } catch (err) {
      failed.push(no)
      consecutiveFails++
      console.error(`[${no}/${TOTAL}] 실패: ${err.message}`)

      if (consecutiveFails >= MAX_CONSECUTIVE_FAILS) {
        console.error(
          `\n연속 ${MAX_CONSECUTIVE_FAILS}번 실패해서 멈출게요. 지금까지 받은 데이터는 저장해요.\n` +
            '인증키가 맞는지, 활용신청이 승인됐는지(발급 직후엔 1~2시간 걸릴 수 있어요), ' +
            '하루 호출 한도(1,000회)를 넘지 않았는지 확인하세요.'
        )
        break
      }
    }

    if (no % 50 === 0) await save(flowers) // 중간 저장
    await sleep(DELAY_MS)
  }

  await save(flowers)
  console.log(`\n완료: ${flowers.length}개를 ${OUT_FILE} 에 저장했어요.`)
  if (failed.length) {
    console.log(`실패한 번호: ${failed.join(', ')}  → 스크립트를 다시 실행하면 이어서 받아요.`)
  }
}

main()
