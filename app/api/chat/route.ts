import { NextResponse } from "next/server";
import { Groq } from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const MODEL_CANDIDATES = [
  process.env.GROQ_MODEL || "llama3-8b-8192",
  "llama-3.1-8b-instant",
  "llama-3.1-8b",
  "llama-3-8b-8192",
];

export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    if (!process.env.GROQ_API_KEY || process.env.GROQ_API_KEY === "your_groq_api_key_here") {
      return NextResponse.json(
        { error: "GROQ_API_KEY belum di-set di .env.local. Isi lalu restart server." },
        { status: 500 }
      );
    }

    for (const model of MODEL_CANDIDATES) {
      try {
        const chatCompletion = await groq.chat.completions.create({
          messages: [
            { role: "system", content: "Kamu adalah asisten AI NFT yang ramah dan membantu." },
            { role: "user", content: message },
          ],
          model,
        });
        const content = chatCompletion.choices?.[0]?.message?.content || "";
        if (content) return NextResponse.json({ response: content, model });
      } catch (err: any) {
        const status = err?.status || err?.response?.status;
        const body = err?.error || err?.response?.data || err?.message;
        console.error(`[GROQ] Gagal model ${model}:`, status, body);
        continue;
      }
    }

    return NextResponse.json(
      { error: "Semua model GROQ gagal. Periksa GROQ_MODEL/GROQ_API_KEY." },
      { status: 502 }
    );
  } catch (error: any) {
    console.error("Error in chat API:", error);
    return NextResponse.json({ error: "Maaf, terjadi kesalahan. Coba lagi nanti." }, { status: 500 });
  }
}
