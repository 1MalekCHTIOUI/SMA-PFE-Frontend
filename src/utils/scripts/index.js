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

  