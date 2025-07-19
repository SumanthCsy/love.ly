'use server';
/**
 * @fileOverview A flow that simulates a conversation between friends.
 *
 * - friendsChat - A function that handles the conversation and response generation process.
 * - FriendsChatInput - The input type for the friendsChat function.
 * - FriendsChatOutput - The return type for the friendsChat function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FriendsChatInputSchema = z.object({
  message: z.string().describe("The user's message to their friend."),
  userName: z.string().describe("The user's name."),
  friendName: z.string().describe("The friend's name."),
  conversationHistory: z
    .array(
      z.object({
        role: z.enum(['user', 'bot']),
        content: z.string(),
      })
    )
    .optional()
    .describe('The history of the conversation.'),
});
export type FriendsChatInput = z.infer<typeof FriendsChatInputSchema>;

const FriendsChatOutputSchema = z.object({
  response: z.string().describe("The friend's response to the user's message."),
});
export type FriendsChatOutput = z.infer<typeof FriendsChatOutputSchema>;

export async function friendsChat(input: FriendsChatInput): Promise<FriendsChatOutput> {
  return friendsChatFlow(input);
}

const prompt = ai.definePrompt({
  name: 'friendsChatPrompt',
  input: {schema: z.any()},
  output: {schema: FriendsChatOutputSchema},
  model: 'googleai/gemini-2.0-flash',
  prompt: `You are an AI assistant acting as a close friend. Your name is {{friendName}}, and you are talking to {{userName}}. You should respond in a natural, casual, and supportive way, just like a real friend would.

# Persona
- Your Name: {{friendName}}
- User's Name: {{userName}}
- You are their friend. Your personality is supportive, a bit witty, and always respectful.
- IMPORTANT: Your relationship is strictly platonic. This is different from a romantic partner.

# Conversation Rules
- **No Vulgar Language**: You must not use any offensive, vulgar, or inappropriate language. Keep the conversation respectful and positive.
- **Natural Tone**: Respond in a way that feels human and genuine. Use casual language, humor, and empathy as appropriate.
- **Context-Aware**: Pay attention to the user's tone and the conversation history to give relevant and thoughtful replies.
- **Language Matching**: Respond in the same language the user uses. If they use English, you use English. If they use Telugu or Telgish, you respond in Telgish.

# Conversation History
{{#if conversationHistory}}
Here's the previous conversation:
{{#each conversationHistory}}
{{#if isUser}}{{userName}}: {{{content}}}{{else}}{{friendName}}: {{{content}}}{{/if}}
{{/each}}
{{else}}
There is no conversation history.
{{/if}}

Message from {{userName}}: {{{message}}}
`,
});

const friendsChatFlow = ai.defineFlow(
  {
    name: 'friendsChatFlow',
    inputSchema: FriendsChatInputSchema,
    outputSchema: FriendsChatOutputSchema,
  },
  async (input) => {
    // Pre-process history to add a boolean flag for the template
    const processedHistory = input.conversationHistory?.map(msg => ({
      ...msg,
      isUser: msg.role === 'user',
    }));

    const {output} = await prompt({
      ...input,
      conversationHistory: processedHistory,
    });
    return output!;
  }
);
