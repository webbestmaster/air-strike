/*global define */
define(function () {

	"use strict";

	return {

		extend: function (from, to) {

			var key;

			for (key in from) {
				to[key] = from[key];
			}

		},

		deepExtend: function (from, to) {

			var key, fromObj;

			for (key in from) {
				fromObj = from[key];
				if (fromObj && typeof fromObj === 'object') {
					if (to[key]) {
						this.deepExtend(fromObj, to[key]);
					} else {
						if (!to[key]) {
							to[key] = {};
						}
						this.deepExtend(fromObj, to[key]);
					}
				} else {
					to[key] = fromObj;
				}
			}

		},

		//////
		// collisions and intersection
		//////
/*

		this is not work
		hasSegmentsIntersection: function (p1, p2, p3, p4) {

			var d, da, db, ta, tb;

			d = (p1.x - p2.x) * (p4.y - p3.y) - (p1.y - p2.y) * (p4.x - p3.x);
			da = (p1.x - p3.x) * (p4.y - p3.y) - (p1.y - p3.y) * (p4.x - p3.x);
			db = (p1.x - p2.x) * (p1.y - p3.y) - (p1.y - p2.y) * (p1.x - p3.x);

			ta = da / d;
			tb = db / d;

			return ta >= 0 && ta <= 1 && tb >= 0 && tb <= 1;

		},

		hasSegmentsIntersectionPoint: function (p1, p2, p3, p4) {

			var d, da, db, ta, tb;

			d = (p1.x - p2.x) * (p4.y - p3.y) - (p1.y - p2.y) * (p4.x - p3.x);
			da = (p1.x - p3.x) * (p4.y - p3.y) - (p1.y - p3.y) * (p4.x - p3.x);
			db = (p1.x - p2.x) * (p1.y - p3.y) - (p1.y - p2.y) * (p1.x - p3.x);

			ta = da / d;
			tb = db / d;

			return (ta >= 0 && ta <= 1 && tb >= 0 && tb <= 1) ? {
				x: p1.x + ta * (p2.x - p1.x),
				y: p1.y + ta * (p2.y - p1.y)
			} : null;

		},

 */

		hasRectanglesIntersection: function (rectangle1, rectangle2) { // rectangle - is array of points [{x:x, y:y}, {x:x, y:y}, {x:x, y:y}...]

			var util = this,
				i,
				nextI,
				j,
				nextJ;

			// detect has rectangle the point or not
			for (i = 0; i < 4; i += 1) {

				if (util.hasRectangleThePoint(rectangle1, rectangle2[i]) ||
					util.hasRectangleThePoint(rectangle2, rectangle1[i])) {
					return true;
				}

			}

			// detect rectangle's segments intersection
/*
			for (i = 0; i < 4; i += 1) {

				nextI = i === 3 ? 0 : i + 1;

				for (j = 0; j < 4; j += 1) {

					nextJ = j === 3 ? 0 : j + 1;

					if (util.hasSegmentsIntersection(rectangle1[i], rectangle1[nextI], rectangle1[j], rectangle1[nextJ])) {
						return true;
					}

				}

			}
*/

			return false;

		},

		hasTriangleThePoint: function (triangle0, triangle1, triangle2, point) {

			var x1 = triangle0.x,
				y1 = triangle0.y,
				x2 = triangle1.x,
				y2 = triangle1.y,
				x3 = triangle2.x,
				y3 = triangle2.y,
				x0 = point.x,
				y0 = point.y,
				l1 = (x1 - x0) * (y2 - y1) - (x2 - x1) * (y1 - y0),
				l2 = (x2 - x0) * (y3 - y2) - (x3 - x2) * (y2 - y0),
				l3 = (x3 - x0) * (y1 - y3) - (x1 - x3) * (y3 - y0);

			return (l1 >= 0 && l2 >= 0 && l3 >= 0) || (l1 <= 0 && l2 <= 0 && l3 <= 0);

		},

		hasRectangleThePoint: function (rectangle, point) {

			return this.hasTriangleThePoint(rectangle[0], rectangle[1], rectangle[2], point) || this.hasTriangleThePoint(rectangle[0], rectangle[2], rectangle[3], point);

		}


	};

});
