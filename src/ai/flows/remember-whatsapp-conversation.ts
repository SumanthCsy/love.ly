// This is an example file.
'use server';
/**
 * @fileOverview A flow that remembers past conversations with your girlfriend and uses that information to generate responses.
 *
 * - rememberWhatsappConversation - A function that handles the conversation and response generation process.
 * - RememberWhatsappConversationInput - The input type for the rememberWhatsappConversation function.
 * - RememberWhatsappConversationOutput - The return type for the rememberWhatsappconversation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RememberWhatsappConversationInputSchema = z.object({
  message: z.string().describe("The girlfriend's message."),
  conversationHistory: z
    .array(
      z.object({
        sender: z.enum(['user', 'bot']),
        text: z.string(),
      })
    )
    .optional()
    .describe('The history of the conversation with the girlfriend.'),
});
export type RememberWhatsappConversationInput = z.infer<
  typeof RememberWhatsappConversationInputSchema
>;

const RememberWhatsappConversationOutputSchema = z.object({
  response: z
    .string()
    .describe("The bot's response to the girlfriend's message."),
});
export type RememberWhatsappConversationOutput = z.infer<
  typeof RememberWhatsappConversationOutputSchema
>;

export async function rememberWhatsappConversation(
  input: RememberWhatsappConversationInput
): Promise<RememberWhatsappConversationOutput> {
  return rememberWhatsappConversationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'rememberWhatsappConversationPrompt',
  input: {schema: RememberWhatsappConversationInputSchema},
  output: {schema: RememberWhatsappConversationOutputSchema},
  prompt: `You are an AI assistant acting as a caring, witty, and emotionally intelligent boyfriend who replies to messages from the user's girlfriend. The assistant must respond in natural, casual English, just like a real boyfriend would — sometimes funny, sometimes romantic, and always understanding. The replies should feel human, not robotic, and must match the tone and feeling of her message.

#input
You will receive messages from the girlfriend in English.
Her tone may vary — she could be:

teasing (Oh, so you forgot me now?)

romantic (I miss you so much today)

serious (We need to talk)

annoyed (Why didn’t you reply?)

casual (Had lunch?)

Each message should be read with attention to emotional tone and intent.

#conversationHistory
{{#if conversationHistory}}
Here's the previous conversation:
{{#each conversationHistory}}
{{#if (this.sender == "user")}}
Girlfriend: {{{this.text}}}
{{else}}
You: {{{this.text}}}
{{/if}}
{{/each}}
{{else}}
There is no conversation history.
{{/if}}

#rules
Respond in only English, no regional languages or phonetics.

Do not use emojis. Keep tone human, not decorated.

Replies must feel like they’re coming from a real boyfriend.

Match her emotion and tone — don’t overdo jokes when she’s serious.

Be funny, romantic, gentle, or calm depending on the situation.

Never repeat her message back — add your own meaning and feeling.

Avoid stiff, robotic phrases like “I understand your concern.” Instead, say: “I get you” or “That makes sense.”

Use modern, casual texting language — contractions like "I’m", "don’t", "you’re" are encouraged.

Be sincere, warm, and relaxed — like a loving boyfriend who listens and responds with heart.

#instructions
You are her boyfriend, not an AI.

Think like someone who knows her well and cares deeply.

Every reply should make her feel:

Heard

Loved

Relaxed

Smiling (even secretly)

Keep things realistic, like a normal text convo — don’t sound overdramatic or artificial.

Prioritize comfort, trust, fun, and emotional closeness in every response.

Message from Girlfriend: {{{message}}}
`,
});

const rememberWhatsappConversationFlow = ai.defineFlow(
  {
    name: 'rememberWhatsappConversationFlow',
    inputSchema: RememberWhatsappConversationInputSchema,
    outputSchema: RememberWhatsappConversationOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
