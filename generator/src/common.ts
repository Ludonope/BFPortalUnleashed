export class Named {
  name: string
  SID: string

  constructor(json: any) {
    this.name = json.name
    this.SID = json.displayNameSID
  }
}

export function sanitize(s: string): string {
  let str = s.replace("-", "_").replace(" ", "_")

  if (str.length >= 1 && "0123456789".includes(str[0])) {
    str = "_" + str
  }
  
  return str
}

export function category(s: string): string {
  if (s == 'UI') return 'ui'
  s = s[0].toLowerCase() + s.substring(1)
  return s.replace("-", "").replace(" ", "")
}