

function highlight(searchTerm: string, content: string, caseSensitive = false) {

    let final = '';
    let splitFlag = null;
    let matchFlag = null;

    let spanStart = '<span class="text-highlight">';
    let spanEnd = '</span>';
    if (!caseSensitive) {
      splitFlag = 'i';
      matchFlag = 'gi';
    } else {
      splitFlag = '';
      matchFlag = 'g';
    }
    const searchPattern = new RegExp(searchTerm, splitFlag);
    const matchpattern = new RegExp(searchTerm, matchFlag);

    let separatedText;
    let separatedSearchedText;

    if (searchTerm !== undefined && searchTerm != null && searchTerm.length > 0 && searchTerm[0] !== '.') {
      separatedText = content.split(searchPattern);
      separatedSearchedText = content.match(matchpattern);

      if (separatedSearchedText != null && separatedSearchedText.length > 0) {
        for (let i = 0; i < separatedText.length; i++) {
          if (i <= separatedSearchedText.length - 1) {
            final += separatedText[i] + spanStart + separatedSearchedText[i] + spanEnd;
          } else {
            final += separatedText[i];
          }
        }
      }
      if (final.length > 0) {
        return `<span>${final}<span>`;
      } else {
        return content;
      }
    } else {
      return content;
    }

}

export { highlight };