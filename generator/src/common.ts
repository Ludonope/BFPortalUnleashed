export class Named {
  name: string
  SID: string

  constructor(json: any) {
    this.name = json.name
    this.SID = json.displayNameSID
  }
}

export function sanitize(s: string): string {
  return s.replace("-", "_").replace(" ", "_")
}

export function category(s: string): string {
  if (s == 'UI') return 'ui'
  s = s[0].toLowerCase() + s.substring(1)
  return s.replace("-", "").replace(" ", "")
}