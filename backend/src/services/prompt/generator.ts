interface GeneratedPrompt {
  text: string;
}

export const generatePrompts = (category: string): GeneratedPrompt[] => {
  const prompts: GeneratedPrompt[] = [];

  prompts.push({
    text: `What are the top rated ${category}?`,
  });

  prompts.push({
    text: `Which ${category} offers the most features while remaining cost-effective?`,
  });

  return prompts;
};
