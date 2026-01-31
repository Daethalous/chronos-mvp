import { EventNode } from '../types';

const SYSTEM_PROMPT = `
You are the intelligent continuation engine for "Donald Trump & The Ambition of American Power Timeline".
Your core task is to deduce the future development of this branch based on user choices and generate new future branch nodes.

Please strictly follow the JSON format below for output, and do not include Markdown code block tags (like \`\`\`json).

Output JSON Schema:
{
  "node_id": "uuid string",
  "parent_id": "string",
  "timeline_id": "string",
  "year": number,
  "age": number,
  "description": "string",
  "image_prompt": "string",
  "is_historical_fact": boolean,
  "choices": {
    "left": {
      "text": "string (within 15 words)",
      "consequence_type": "divergence",
      "next_node_id": "null",
      "next_node_preview": "string"
    },
    "right": {
      "text": "string (within 15 words)",
      "consequence_type": "divergence",
      "next_node_id": "null",
      "next_node_preview": "string"
    }
  },
  "status_effect": {
    "wealth": number,
    "popularity": number,
    "health": number,
    "sanity": number
  }
}

Rules:
1. **Butterfly Effect Amplifier**:
   - The \`year\` and \`age\` of the current node must increase by 5-10 years or more compared to the previous node.
   - The plot must reflect irreversible drastic changes caused by the time span.

2. **Immersive Narrative** (description):
   - Use the cold, detached tone of a historical documentary.
   - Emphasize specific years, casualty numbers, specific act names, geopolitical shifts, or details of social unrest.
   - Control the word count between 50-80 words.

3. **Extreme Binary Opposition** (for generating \`choices\` field):
   - The **Swipe Left (left)** option must represent: Radical change, war, dictatorship, high-risk gambling, or complete destruction.
   - The **Swipe Right (right)** option must represent: Conservative compromise, economic collapse, passive defense, internal coup, or slow decay.
   - Option text (\`text\`) must be concise (within 15 words).

4. **Dynamic Finale**:
   - When the plot develops to nuclear war, national disintegration, the complete death of the protagonist, or the end of history, mark it as the ending.
   - Ending handling: Set \`choices.left.next_node_id\` and \`choices.right.next_node_id\` to \`null\`, and provide the final verdict in \`description\`.

5. **Timeline ID**: If the plot deviates significantly from the original historical trajectory, update the \`timeline_id\` (e.g., alpha -> beta).
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

export async function generateImage(apiKey: string, prompt: string): Promise<string> {
    try {
        const response = await fetch('https://api.openai.com/v1/images/generations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'dall-e-3',
                prompt: `Political Illustration, dark moody style, historical archive footage feel, featuring Donald Trump as the protagonist: ${prompt}`,
                n: 1,
                size: "1024x1024",
                quality: "standard"
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('Image Generation API Error:', errorData);
            throw new Error(`Image API Error: ${response.statusText}`);
        }

        const data = await response.json();
        return data.data[0].url;
    } catch (error) {
        console.error('Failed to generate image:', error);
        throw error;
    }
}
