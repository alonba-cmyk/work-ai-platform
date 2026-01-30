// Mapping of tool names to their logo URLs or components
// Using icon placeholders for now - these can be replaced with actual brand logos

export const toolLogos: Record<string, string> = {
  // Social Media Management
  'Hootsuite': 'https://logo.clearbit.com/hootsuite.com',
  'Buffer': 'https://logo.clearbit.com/buffer.com',
  'Sprout Social': 'https://logo.clearbit.com/sproutsocial.com',
  
  // Marketing Automation
  'HubSpot Marketing Hub': 'https://logo.clearbit.com/hubspot.com',
  'Marketo': 'https://logo.clearbit.com/marketo.com',
  'Pardot': 'https://logo.clearbit.com/salesforce.com',
  
  // Project Management / Content
  'CoSchedule': 'https://logo.clearbit.com/coschedule.com',
  'Trello': 'https://logo.clearbit.com/trello.com',
  'Asana': 'https://logo.clearbit.com/asana.com',
  
  // CRM
  'Salesforce': 'https://logo.clearbit.com/salesforce.com',
  'Pipedrive': 'https://logo.clearbit.com/pipedrive.com',
  'Zoho CRM': 'https://logo.clearbit.com/zoho.com',
  
  // Customer Support
  'Zendesk': 'https://logo.clearbit.com/zendesk.com',
  'Intercom': 'https://logo.clearbit.com/intercom.com',
  'Freshdesk': 'https://logo.clearbit.com/freshworks.com',
  
  // Analytics
  'Google Analytics': 'https://logo.clearbit.com/google.com',
  'Mixpanel': 'https://logo.clearbit.com/mixpanel.com',
  'Amplitude': 'https://logo.clearbit.com/amplitude.com',
  
  // Communication
  'Slack': 'https://logo.clearbit.com/slack.com',
  'Microsoft Teams': 'https://logo.clearbit.com/microsoft.com',
  'Zoom': 'https://logo.clearbit.com/zoom.us',
};

export function getToolLogo(toolName: string): string | null {
  return toolLogos[toolName] || null;
}
