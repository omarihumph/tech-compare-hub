import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { products } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    if (!products || products.length < 2) {
      throw new Error("At least 2 products are required for comparison");
    }

    console.log("Analyzing products for recommendation:", products.length);

    const productSummary = products.map((p: any, i: number) => `
Product ${i + 1}: ${p.name}
- Brand: ${p.brand || 'Unknown'}
- Price: $${p.price}
- Category: ${p.category}
- Description: ${p.description || 'No description'}
- Specifications: ${p.specs ? JSON.stringify(p.specs) : 'None listed'}
`).join('\n');

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: `You are a tech product expert helping users choose the best product. Analyze the products and provide a clear recommendation. Be concise but helpful. Focus on value for money, features, and overall quality. Always respond in JSON format with the following structure:
{
  "recommendedIndex": <number 0-based index of best product>,
  "productName": "<name of recommended product>",
  "reasoning": "<2-3 sentences explaining why this is the best choice>",
  "highlights": ["<key advantage 1>", "<key advantage 2>", "<key advantage 3>"],
  "considerations": "<brief mention of what the user should consider>"
}`
          },
          {
            role: "user",
            content: `Please analyze these products and recommend the best one:\n${productSummary}`
          }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    if (!content) {
      throw new Error("No response from AI");
    }

    console.log("AI response:", content);

    // Parse the JSON response
    let recommendation;
    try {
      // Clean up the response in case it has markdown code blocks
      const cleanedContent = content.replace(/```json\n?|\n?```/g, '').trim();
      recommendation = JSON.parse(cleanedContent);
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError);
      throw new Error("Failed to parse AI recommendation");
    }

    return new Response(JSON.stringify({ recommendation }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in ai-recommend function:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
