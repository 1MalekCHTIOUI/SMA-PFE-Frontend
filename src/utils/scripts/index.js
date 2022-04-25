export const capitalizeFirstLetter = (string) => {
    const s = replaceDash(string)
    return s
    ?.toLowerCase()
    .split(' ')
    .map(function(word) {
        return word[0].toUpperCase() + word.substr(1);
    })
    .join(' ');
 }

export const replaceDash = (string) => {
    return string?.replaceAll("_", " ")
}

export const randomNumber = () => {
    return Math.floor(Math.random() * (999999999 - 100000000 + 1) + 100000000)
}

export const addStr = (str, index, stringToAdd) => {
    return str.substring(0, index) + stringToAdd + str.substring(index, str.length);
  }

  