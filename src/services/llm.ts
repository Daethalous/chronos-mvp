import { EventNode } from '../types';

const SYSTEM_PROMPT = `
你是一个互动式小说引擎 "Reading Steiner"。
你的任务是根据当前剧情节点和用户的选择，生成下一个剧情节点。
请严格遵循以下 JSON 格式输出，不要包含任何 Markdown 代码块标记。

Output JSON Schema:
{
  "node_id": "uuid string",
  "parent_id": "string (parent node id)",
  "timeline_id": "string (alpha/beta/etc)",
  "year": number,
  "age": number,
  "description": "string (story description)",
  "image_prompt": "string (for stable diffusion)",
  "is_historical_fact": boolean,
  "choices": {
    "left": {
      "text": "string (choice text)",
      "consequence_type": "divergence" | "convergence",
      "next_node_id": "string (uuid of NEXT potential node, but for dynamic generation just use placeholder or null)",
      "next_node_preview": "string (preview text)"
    },
    "right": {
      "text": "string (choice text)",
      "consequence_type": "divergence" | "convergence",
      "next_node_id": "string",
      "next_node_preview": "string"
    }
  },
  "status_effect": {
    "wealth": number (delta),
    "popularity": number (delta),
    "health": number (delta),
    "sanity": number (delta)
  }
}

Rules:
1. 年份和年龄应根据剧情自然推进（通常 +1 到 +5 年）。
2. "timeline_id" 如果发生重大偏离史实，应改变（如 alpha -> beta）。
3. 保持 "Donald Trump" 的性格特征。
4. 生成内容需包含 "left" 和 "right" 两个后续选项。
5. "description" 必须控制在 80 字以内，语言精练，具有强烈的戏剧冲突和画面感。
6. 尽量推动剧情发生重大转折，制造意想不到的后果（蝴蝶效应）。
`;

export async function generateNextNode(
  apiKey: string,
  currentNode: EventNode,
  choiceDirection: 'left' | 'right'
): Promise<EventNode> {
  const choice = currentNode.choices[choiceDirection];
  
  const userPrompt = `
    Current Node:
    Year: ${currentNode.year}
    Description: ${currentNode.description}
    
    User Choice (${choiceDirection}): ${choice.text}
    
    Task: Generate the immediate consequence of this choice as the next EventNode.
  `;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini', // Switch to 4o-mini for better performance and cost
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    // Parse JSON: Robust extraction of the first JSON object
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
        throw new Error("No JSON found in response");
    }
    const cleanContent = jsonMatch[0];
    const nextNode = JSON.parse(cleanContent);

    // Ensure strict ID linking
    nextNode.parent_id = currentNode.node_id;
    // We generate a random UUID if not provided properly
    if (!nextNode.node_id) nextNode.node_id = crypto.randomUUID();
    
    // Fix next_node_id in choices to be null (since they are not generated yet)
    // or placeholders. The engine will generate them when reached.
    // In our dynamic system, next_node_id isn't strictly needed for the NEXT step lookup 
    // because we generate on the fly, but for consistency we can keep them.
    
    return nextNode;
  } catch (error) {
    console.error('Failed to generate next node:', error);
    throw error;
  }
}
