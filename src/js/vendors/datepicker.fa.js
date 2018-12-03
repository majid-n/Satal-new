/**
 * Persian translation & Convert to Jalali Calendar for bootstrap-datepicker
 * Rahman Mousavian	<mousavian.rahman@gmail.com>
 *  Using jQuery Datepicker (Jalali Calendar) By:
 * 	Mahdi Hasheminezhad. email: hasheminezhad at gmail dot com (http://hasheminezhad.com)
 */
function mod(e, t) {
  return e - t * Math.floor(e / t);
}
function leap_gregorian(e) {
  return e % 4 == 0 && !(e % 100 == 0 && e % 400 != 0);
}
function gregorian_to_jd(e, t, n) {
  return (
    GREGORIAN_EPOCH -
    1 +
    365 * (e - 1) +
    Math.floor((e - 1) / 4) +
    -Math.floor((e - 1) / 100) +
    Math.floor((e - 1) / 400) +
    Math.floor(
      (367 * t - 362) / 12 + (t <= 2 ? 0 : leap_gregorian(e) ? -1 : -2) + n
    )
  );
}
function jd_to_gregorian(e) {
  var t, n, r, i, s, o, u, a, f, l, c, h, p;
  t = Math.floor(e - 0.5) + 0.5;
  n = t - GREGORIAN_EPOCH;
  r = Math.floor(n / 146097);
  i = mod(n, 146097);
  s = Math.floor(i / 36524);
  o = mod(i, 36524);
  u = Math.floor(o / 1461);
  a = mod(o, 1461);
  f = Math.floor(a / 365);
  c = r * 400 + s * 100 + u * 4 + f;
  if (!(s == 4 || f == 4)) {
    c++;
  }
  h = t - gregorian_to_jd(c, 1, 1);
  p = t < gregorian_to_jd(c, 3, 1) ? 0 : leap_gregorian(c) ? 1 : 2;
  month = Math.floor(((h + p) * 12 + 373) / 367);
  day = t - gregorian_to_jd(c, month, 1) + 1;
  return new Array(c, month, day);
}
function leap_islamic(e) {
  return (e * 11 + 14) % 30 < 11;
}
function islamic_to_jd(e, t, n) {
  return (
    n +
    Math.ceil(29.5 * (t - 1)) +
    (e - 1) * 354 +
    Math.floor((3 + 11 * e) / 30) +
    ISLAMIC_EPOCH -
    1
  );
}
function jd_to_islamic(e) {
  var t, n, r;
  e = Math.floor(e) + 0.5;
  t = Math.floor((30 * (e - ISLAMIC_EPOCH) + 10646) / 10631);
  n = Math.min(12, Math.ceil((e - (29 + islamic_to_jd(t, 1, 1))) / 29.5) + 1);
  r = e - islamic_to_jd(t, n, 1) + 1;
  return new Array(t, n, r);
}
function leap_persian(e) {
  return ((((e - (e > 0 ? 474 : 473)) % 2820) + 474 + 38) * 682) % 2816 < 682;
}
function persian_to_jd(e, t, n) {
  var r, i;
  r = e - (e >= 0 ? 474 : 473);
  i = 474 + mod(r, 2820);
  return (
    n +
    (t <= 7 ? (t - 1) * 31 : (t - 1) * 30 + 6) +
    Math.floor((i * 682 - 110) / 2816) +
    (i - 1) * 365 +
    Math.floor(r / 2820) * 1029983 +
    (PERSIAN_EPOCH - 1)
  );
}
function jd_to_persian(e) {
  var t, n, r, i, s, o, u, a, f, l;
  e = Math.floor(e) + 0.5;
  i = e - persian_to_jd(475, 1, 1);
  s = Math.floor(i / 1029983);
  o = mod(i, 1029983);
  if (o == 1029982) {
    u = 2820;
  } else {
    a = Math.floor(o / 366);
    f = mod(o, 366);
    u = Math.floor((2134 * a + 2816 * f + 2815) / 1028522) + a + 1;
  }
  t = u + 2820 * s + 474;
  if (t <= 0) {
    t--;
  }
  l = e - persian_to_jd(t, 1, 1) + 1;
  n = l <= 186 ? Math.ceil(l / 31) : Math.ceil((l - 6) / 30);
  r = e - persian_to_jd(t, n, 1) + 1;
  return new Array(t, n, r);
}
function JalaliDate(e, t, n) {
  function o(e) {
    var t = 0;
    if (e[1] < 0) {
      t = leap_persian(e[0] - 1) ? 30 : 29;
      e[1]++;
    }
    var n = jd_to_gregorian(persian_to_jd(e[0], e[1] + 1, e[2]) - t);
    n[1]--;
    return n;
  }
  function u(e) {
    var t = jd_to_persian(gregorian_to_jd(e[0], e[1] + 1, e[2]));
    t[1]--;
    return t;
  }
  function a(e) {
    if (e && e.getGregorianDate) e = e.getGregorianDate();
    r = new Date(e);
    r.setHours(r.getHours() > 12 ? r.getHours() + 2 : 0);
    if (!r || r == "Invalid Date" || isNaN(r || !r.getDate())) {
      r = new Date();
    }
    i = u([r.getFullYear(), r.getMonth(), r.getDate()]);
    return this;
  }
  var r;
  var i;
  if (!isNaN(parseInt(e)) && !isNaN(parseInt(t)) && !isNaN(parseInt(n))) {
    var s = o([parseInt(e, 10), parseInt(t, 10), parseInt(n, 10)]);
    a(new Date(s[0], s[1], s[2]));
  } else {
    a(e);
  }
  this.getGregorianDate = function() {
    return r;
  };
  this.setFullDate = a;
  this.setMonth = function(e) {
    i[1] = e;
    var t = o(i);
    r = new Date(t[0], t[1], t[2]);
    i = u([t[0], t[1], t[2]]);
  };
  this.setDate = function(e) {
    i[2] = e;
    var t = o(i);
    r = new Date(t[0], t[1], t[2]);
    i = u([t[0], t[1], t[2]]);
  };
  this.getFullYear = function() {
    return i[0];
  };
  this.getMonth = function() {
    return i[1];
  };
  this.getDate = function() {
    return i[2];
  };
  this.toString = function() {
    return i.join(",").toString();
  };
  this.getDay = function() {
    return r.getDay();
  };
  this.getHours = function() {
    return r.getHours();
  };
  this.getMinutes = function() {
    return r.getMinutes();
  };
  this.getSeconds = function() {
    return r.getSeconds();
  };
  this.getTime = function() {
    return r.getTime();
  };
  this.getTimeZoneOffset = function() {
    return r.getTimeZoneOffset();
  };
  this.getYear = function() {
    return i[0] % 100;
  };
  this.setHours = function(e) {
    r.setHours(e);
  };
  this.setMinutes = function(e) {
    r.setMinutes(e);
  };
  this.setSeconds = function(e) {
    r.setSeconds(e);
  };
  this.setMilliseconds = function(e) {
    r.setMilliseconds(e);
  };
}
var GREGORIAN_EPOCH = 1721425.5;
var ISLAMIC_EPOCH = 1948439.5;
var PERSIAN_EPOCH = 1948320.5;
jQuery(function(e) {
  e.datepicker.regional["fa"] = {
    calendar: JalaliDate,
    closeText: "بستن",
    prevText: "قبل",
    nextText: "بعد",
    currentText: "امروز",
    monthNames: [
      "فروردین",
      "اردیبهشت",
      "خرداد",
      "تیر",
      "مرداد",
      "شهریور",
      "مهر",
      "آبان",
      "آذر",
      "دی",
      "بهمن",
      "اسفند"
    ],
    monthNamesShort: [
      "فروردین",
      "اردیبهشت",
      "خرداد",
      "تیر",
      "مرداد",
      "شهریور",
      "مهر",
      "آبان",
      "آذر",
      "دی",
      "بهمن",
      "اسفند"
    ],
    dayNames: [
      "یکشنبه",
      "دوشنبه",
      "سه شنبه",
      "چهارشنبه",
      "پنجشنبه",
      "جمعه",
      "شنبه"
    ],
    dayNamesShort: ["یک", "دو", "سه", "چهار", "پنج", "جمعه", "شنبه"],
    dayNamesMin: ["ی", "د", "س", "چ", "پ", "ج", "ش"],
    weekHeader: "ه",
    dateFormat: "dd/mm/yy",
    firstDay: 6,
    isRTL: true,
    showMonthAfterYear: false,
    yearSuffix: "",
    calculateWeek: function(e) {
      var t = new JalaliDate(
        e.getFullYear(),
        e.getMonth(),
        e.getDate() + (e.getDay() || 7) - 3
      );
      return (
        Math.floor(
          Math.round(
            (t.getTime() - new JalaliDate(t.getFullYear(), 0, 1).getTime()) /
              864e5
          ) / 7
        ) + 1
      );
    }
  };
  e.datepicker.setDefaults(e.datepicker.regional["fa"]);
});

module.exports = JalaliDate;