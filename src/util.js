export const snakeToCamel = (s) => {
  let newS = s.replace(/(_\w)/g, (m) => ` ${m[1].toUpperCase()}`)
  newS = s.charAt(0).toUpperCase() + newS.slice(1)
  return newS
}