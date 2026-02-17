import { supabase } from "@/lib/supabase";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const { resource_id } = await req.json();

    // 1️⃣ Fetch resource from Supabase
    const { data: resource, error } = await supabase
      .from("resources")
      .select("*")
      .eq("id", resource_id)
      .single();

    if (error || !resource) {
      return Response.json({ error: "Resource not found" }, { status: 404 });
    }

    // 2️⃣ If stored AI exists (Plan B fallback)
    if (resource.summary && resource.important_questions && resource.concept_map) {
      return Response.json({
        source: "stored",
        summary: resource.summary,
        important_questions: resource.important_questions,
        concept_map: resource.concept_map,
      });
    }

    // 3️⃣ Generate dynamically (Plan A)
    const prompt = `
Analyze the following academic material and provide:
1. A concise 10-point revision summary.
2. Five probable long-answer exam questions.
3. Five probable short-answer questions.
4. A structured concept hierarchy listing main topics and subtopics.

Content:
${resource.summary || "PDF extracted text here"}
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    const aiOutput = completion.choices[0].message.content;

    return Response.json({
      source: "dynamic",
      result: aiOutput,
    });

  } catch (err) {
    return Response.json({ error: "AI generation failed" }, { status: 500 });
  }
}
