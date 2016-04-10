function EndlessArray(length) {

	this.l = length;
	this.a = new Array(length);
	this.c = 0;

}

EndlessArray.prototype.push = function (item) {

	var e = this;

	e.a[e.c] = item;

	if (e.c === e.l - 1) {
		e.c = 0;
	} else {
		e.c += 1;
	}

	return e;

};

EndlessArray.prototype.oEach = function (fn) {

	var e = this,
		cursor = e.c,
		array = e.a,
		i, len;

	for (i = cursor, len = e.l; i < len; i += 1) {
		fn(array[i]);
	}

	for (i = 0; i < cursor; i += 1) {
		fn(array[i]);
	}

	return this;

};

EndlessArray.prototype.each = function (fn) {

	var e = this,
		array = e.a,
		i, len;

	for (i = 0, len = e.l; i < len; i += 1) {
		fn(array[i]);
	}

	return e;

};

EndlessArray.prototype.get = function (i) {

	var e = this,
		len = e.l,
		index = e.c + i;

	if (index < len) {
		return e.a[index];
	}

	return e.a[index % len];

};

EndlessArray.prototype.getLast = function () {

	var e = this,
		i = e.c - 1;

	if (i < 0 ) {
		return this.a[e.l + i];
	}

	return this.a[i];

};

EndlessArray.prototype.getLastBy = function (index) {

	var e = this,
		i = e.c - 1 - index;

	if (i < 0 ) {
		return this.a[e.l + i];
	}

	return this.a[i];

};

EndlessArray.prototype.fill = function (value) {

	var e = this,
		array = e.a,
		i, len;

	e.c = 0;

	for (i = 0, len = e.l; i < len; i += 1) {
		array[i] = value;
	}

	return e;

};

// extra method
/*
 EndlessArray.prototype.average = function () {

 var array = this.a;

 var i, len;
 var sum = 0;

 for (i = 0, len = this.l; i < len; i += 1) {
 sum += array[i];
 }

 return sum / len;

 };
 */


/*
 // just for tests
 var tt = new EndlessArray(5);
 tt.push(1);
 tt.push(2);
 tt.push(3);
 tt.push(4);
 tt.push(5);

 window.tt = tt;
 */

export default EndlessArray;
