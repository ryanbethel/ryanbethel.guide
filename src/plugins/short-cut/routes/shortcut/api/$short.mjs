import {SxgToDate} from 'newbase60'
export async function get(req) {
  const {short} = req.pathParameters
  const parsed = parseShort(short)
  const {year,dayOfMonth,month} = extractDateParts(SxgToDate(parsed.sxgDate))
  const types = {b:'blog',n:'note',c:'comment'}
  const location =  `/${year}/${month}/${dayOfMonth}/${types[parsed.type]}/${parsed.ordinal}`

  return {
    status:302,
    location
  }
}

function extractDateParts(date) {
  if (!(date instanceof Date)) {
    throw new Error('Invalid date object');
  }

  let year = date.getFullYear();
  let dayOfMonth = date.getDate();
  // JavaScript's getMonth() function returns a 0-based month number, so we add 1 to get the human-readable month number
  let month = date.getMonth() + 1;

  return {
    year,
    dayOfMonth,
    month
  };
}

function parseShort(str) {
  if (str.length < 5) {
    throw new Error('Invalid string format');
  }

  let type = str.charAt(0);
  let sxgDate = str.substring(1, 4);
  let ordinal = parseInt(str.substring(4));

  if (isNaN(ordinal)) {
    throw new Error('Invalid number format');
  }

  return {
    type,
    sxgDate,
    ordinal
  };
}
