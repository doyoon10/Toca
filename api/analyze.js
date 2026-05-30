// api/analyze.js — Vercel 서버리스 함수
// Vercel이 /api/analyze 경로로 자동 연결해줘요

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { input } = req.body;
  if (!input?.trim()) return res.status(400).json({ error: '입력값이 없습니다.' });

  const API_KEY = process.env.GROQ_API_KEY;
  if (!API_KEY) return res.status(500).json({ error: 'API 키가 설정되지 않았습니다.' });

  try {
    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        max_tokens: 4000,
        messages: [
          {
            role: 'system',
            content: '너는 영어 단어/표현 분석 전문가야. 반드시 순수 JSON 배열로만 응답해. 마크다운, 설명, 코드블록 없이 JSON만. 응답이 길어도 반드시 JSON 배열을 완전하게 ] 로 닫아서 끝내야 해.'
          },
          {
            role: 'user',
            content: `다음 입력에서 영어 단어와 표현들을 모두 추출하고, 각각의 토익 시험에 맞는 한국어 뜻과 품사를 분석해줘. JSON 배열을 반드시 완전하게 ] 로 닫아서 끝내야 해.
형식: [{"en":"단어또는표현","ko":"한국어 뜻","pos":"noun|verb|adj|adv|prep|phrase"}]

입력: ${input.trim()}`
          }
        ]
      })
    });

    const data = await groqRes.json();

    if (!groqRes.ok) {
      console.error('[Groq 오류]', data);
      return res.status(502).json({ error: `Groq API 오류: ${groqRes.status}` });
    }

    let text = data.choices[0].message.content;
    let cleaned = text.replace(/```json|```/g, '').trim();

    // JSON이 잘렸을 경우 복구 시도
    if (!cleaned.endsWith(']')) {
      const lastComma = cleaned.lastIndexOf(',');
      const lastBrace = cleaned.lastIndexOf('{');
      if (lastBrace > lastComma) {
        cleaned = cleaned.slice(0, lastBrace).trimEnd().replace(/,$/, '') + ']';
      } else {
        cleaned = cleaned.slice(0, lastComma) + ']';
      }
    }

    const words = JSON.parse(cleaned);
    return res.status(200).json({ words });

  } catch (e) {
    console.error('[analyze 오류]', e.message);
    return res.status(500).json({ error: '서버 내부 오류가 발생했습니다.' });
  }
}
