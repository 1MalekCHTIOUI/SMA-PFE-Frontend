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

export const generateRandomString = () => {
    let theLetters = "abcdefghijklmnopqrstuvwxyz"
    let StrongPasswordArray = []
    let lengthOfPassword = 20
    let capitalise
    for (let i = 0; i < lengthOfPassword; i++) {
        capitalise = Math.round(Math.random() * 1)
        if (capitalise === 0) {
            StrongPasswordArray[i] = theLetters.charAt(Math.round(Math.random() * 25)).toUpperCase()
        }
        else {
            StrongPasswordArray[i] = theLetters.charAt(Math.round(Math.random() * 25))
        }
    }
    let numberOfDigits
    numberOfDigits = Math.round(Math.random() * (lengthOfPassword - 1)) + 1
    let positionForNumeric, theNumber
    for (let i = 0; i < numberOfDigits; i++) {
        positionForNumeric = Math.round(Math.random() * (lengthOfPassword - 1))
        theNumber = Math.round(Math.random() * 9)
        StrongPasswordArray[positionForNumeric] = theNumber
    }
    
    let s = ""
    for(let i=0;i<StrongPasswordArray.length;i++){
        s+=StrongPasswordArray[i]
    }
    return s
}

  