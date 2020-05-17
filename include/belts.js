/*
 Belt module
*/

function BELT_calculateLength(cc, d1t, d2t, crossed) {
	d1 = Math.min(d1t, d2t);
	d2 = Math.max(d1t, d2t);
	theta = Math.asin((crossed ? (d2+d1) : (d2-d1))/2/cc);
	if (crossed)
		return 2*cc*Math.sqrt(1-((d2+d1)/2/cc)*((d2+d1)/2/cc)) + Math.PI*(d1+d2)/2 + theta*(d2+d1);
	else
		return 2*cc*Math.sqrt(1-((d2-d1)/2/cc)*((d2-d1)/2/cc)) + Math.PI*(d1+d2)/2 + theta*(d2-d1);
}

function BELT_calculateWrap1(d1, d2, cc, pitch) {
	theta = Math.asin((d2-d1)/2/cc);
	return d1/2*(Math.PI - 2*theta)/pitch;
}

function BELT_calculateWrap2(d1, d2, cc, pitch) {
	theta = Math.asin((d2-d1)/2/cc);
	return d2/2*(Math.PI + 2*theta)/pitch;
}

function BELT_calculateCenterDist(l, d1, d2, crossed) {
	a = l;
	b = (d1+d2)/2;
	c = (a+b)/2;
	n = 0;
	while (n<100) {
		n++;
		c = (a+b)/2;
		fa = BELT_calculateLength(a, d1, d2, crossed) - l;
		fb = BELT_calculateLength(b, d1, d2, crossed) - l;
		fc = BELT_calculateLength(c, d1, d2, crossed) - l;

		if (Math.abs(fc)<1e-4) {
			break;
		}

		if (fc*fa > 0)	a = c;
		else			b = c;
	}
	return c;
}


var BELT_SIZES = {
	"vex": {
		"5mm": [60,70,80,90,100,104,110,120,130,140,150,160,170,180,200,225,250],
		"3mm": [45,50,55,60,70,85,90,100,105,110,115,120,125,140,180]
	},
	"am": {
		"5mm": [40,45,48,93,55,85,104,107,110,117,120,131,140,151,160,170,180,200]
	}
};
var BELT_MFRS = {"vex": "VexPro", "am": "AndyMark"};

// Taken from https://www.gates.com/content/dam/gates/home/resources/resource-library/catalogs/light-power-and-precision-manual.pdf
var BELT_RATINGS = {
	'htd_3mm': {
		'teeth': [10, 12, 14, 16, 18, 22, 26, 30, 34, 38, 44, 50, 56, 62, 72, 80],
		'rpms': [10, 20, 40, 60, 100, 200, 300, 400, 500, 600, 700, 800, 870, 1000,
				1160, 1450, 1600, 1750, 2000, 2500, 3000, 3500, 5000, 8000, 10000],
		'width_multipliers': {'6mm': 1.00, '9mm': 1.64, '15mm': 3.03},
		'torques': [
			[.4, .5, .5, .6, .7, .9, 1.2, 1.4, 1.6, 1.9, 2.3, 2.8, 3.1, 3.5, 4.0, 4.5],
			[.4, .5, .5, .6, .7, .9, 1.2, 1.4, 1.6, 1.9, 2.3, 2.8, 3.1, 3.5, 4.0, 4.5],
			[.4, .5, .5, .6, .7, .9, 1.2, 1.4, 1.6, 1.9, 2.3, 2.8, 3.1, 3.5, 4.0, 4.5],
			[.4, .5, .5, .6, .7, .9, 1.2, 1.4, 1.6, 1.9, 2.3, 2.8, 3.1, 3.5, 4.0, 4.5],
			[.4, .5, .5, .6, .7, .9, 1.2, 1.4, 1.6, 1.9, 2.3, 2.8, 3.1, 3.5, 4.0, 4.5],
			[.4, .5, .5, .6, .7, .9, 1.2, 1.4, 1.6, 1.9, 2.3, 2.8, 3.1, 3.5, 4.0, 4.5],
			[.3, .4, .5, .6, .7, .8, 1.0, 1.2, 1.5, 1.7, 2.1, 2.5, 2.8, 3.1, 3.6, 4.0],
			[.3, .4, .5, .5, .6, .8, 1.0, 1.2, 1.4, 1.6, 1.9, 2.3, 2.6, 2.8, 3.3, 3.6],
			[.3, .4, .4, .5, .6, .7, .9, 1.1, 1.3, 1.5, 1.8, 2.1, 2.4, 2.6, 3.1, 3.4],
			[.3, .4, .4, .5, .6, .7, .9, 1.0, 1.2, 1.4, 1.7, 2.0, 2.3, 2.5, 2.9, 3.2],
			[.3, .3, .4, .5, .5, .7, .8, 1.0, 1.2, 1.3, 1.6, 1.9, 2.2, 2.4, 2.8, 3.1],
			[.3, .3, .4, .5, .5, .7, .8, 1.0, 1.1, 1.3, 1.6, 1.8, 2.1, 2.3, 2.7, 3.0],
			[.3, .3, .4, .4, .5, .7, .8, .9, 1.1, 1.3, 1.5, 1.8, 2.0, 2.2, 2.6, 2.9],
			[.3, .3, .4, .4, .5, .6, .8, .9, 1.1, 1.2, 1.5, 1.7, 1.9, 2.2, 2.5, 2.8],
			[.2, .3, .4, .4, .5, .6, .7, .9, 1.0, 1.2, 1.4, 1.7, 1.9, 2.1, 2.4, 2.7],
			[.2, .3, .3, .4, .5, .6, .7, .8, 1.0, 1.1, 1.3, 1.5, 1.7, 1.9, 2.2, 2.5],
			[.2, .3, .3, .4, .4, .6, .7, .8, .9, 1.1, 1.3, 1.5, 1.7, 1.9, 2.2, 2.4],
			[.2, .3, .3, .4, .4, .5, .7, .8, .9, 1.0, 1.3, 1.5, 1.6, 1.8, 2.1, 2.3],
			[.2, .3, .3, .4, .4, .5, .6, .8, .9, 1.0, 1.2, 1.4, 1.6, 1.7, 2.0, 2.2],
			[.2, .3, .3, .4, .4, .5, .6, .7, .8, .9, 1.1, 1.3, 1.5, 1.6, 1.9, 2.1],
			[.2, .2, .3, .3, .4, .5, .6, .7, .8, .9, 1.1, 1.2, 1.4, 1.5, 1.8, 1.9],
			[.2, .2, .3, .3, .4, .5, .6, .7, .8, .9, 1.0, 1.2, 1.3, 1.5, 1.7, 1.8],
			[.2, .2, .3, .3, .3, .4, .5, .6, .7, .8, .9, 1.0, 1.2, 1.3, 1.4, 1.6],
			[.2, .2, .2, .3, .3, .4, .4, .5, .6, .6, .7, .8, .9, 1.0, 1.0, 1.1],
			[ .2, .2, .2, .2, .3, .3, .4, .5, .5, .6, .6, .7, .7, .8, 0, 0]
		]
	},
	'htd_5mm': {
		'teeth': [14, 16, 18, 20, 22, 24, 26, 28, 32, 36, 40, 44, 48, 56, 64, 72],
		'rpms': [10, 20, 40, 60, 100, 200, 300, 400, 500, 600, 700, 800, 870, 1000,
				1160, 1400, 1450, 1600, 1750, 1800, 2000, 2500, 3000, 3600, 5000, 8000, 10000],
		'width_multipliers': {'9mm': 1.00, '15mm': 1.89, '25mm': 3.38},
		'torques': [
			[2.1, 2.5, 2.9, 3.3, 3.7, 4.2, 4.6, 5.1, 6.1, 7.1, 8.3, 9.4, 10.7, 12.8, 14.6, 16.5],
			[2.1, 2.5, 2.9, 3.3, 3.7, 4.2, 4.6, 5.1, 6.1, 7.1, 8.3, 9.4, 10.7, 12.8, 14.6, 16.5],
			[2.1, 2.5, 2.9, 3.3, 3.7, 4.2, 4.6, 5.1, 6.1, 7.1, 8.3, 9.4, 10.7, 12.8, 14.6, 16.5],
			[2.1, 2.5, 2.9, 3.3, 3.7, 4.2, 4.6, 5.1, 6.1, 7.1, 8.3, 9.4, 10.7, 12.8, 14.6, 16.5],
			[2.1, 2.5, 2.9, 3.3, 3.7, 4.2, 4.6, 5.1, 6.1, 7.1, 8.3, 9.4, 10.7, 12.8, 14.6, 16.5],
			[2.1, 2.5, 2.9, 3.3, 3.7, 4.2, 4.6, 5.1, 6.1, 7.1, 8.3, 9.4, 10.7, 12.8, 14.6, 16.5],
			[2.0, 2.3, 2.6, 3.0, 3.4, 3.8, 4.2, 4.6, 5.5, 6.4, 7.4, 8.4, 9.5, 11.3, 13.0, 14.6],
			[1.8, 2.1, 2.5, 2.8, 3.1, 3.5, 3.9, 4.3, 5.1, 5.9, 6.8, 7.7, 8.7, 10.4, 11.9, 13.4],
			[1.7, 2.0, 2.3, 2.6, 3.0, 3.3, 3.7, 4.0, 4.8, 5.6, 6.4, 7.3, 8.2, 9.7, 11.1, 12.5],
			[1.7, 1.9, 2.2, 2.5, 2.8, 3.2, 3.5, 3.8, 4.5, 5.3, 6.1, 6.9, 7.7, 9.2, 10.5, 11.9],
			[1.6, 1.9, 2.1, 2.4, 2.7, 3.0, 3.4, 3.7, 4.4, 5.1, 5.8, 6.6, 7.4, 8.8, 10.1, 11.3],
			[1.6, 1.8, 2.1, 2.4, 2.6, 2.9, 3.2, 3.6, 4.2, 4.9, 5.6, 6.3, 7.1, 8.5, 9.7, 10.9],
			[1.5, 1.8, 2.0, 2.3, 2.6, 2.9, 3.2, 3.5, 4.1, 4.8, 5.5, 6.2, 6.9, 8.2, 9.4, 10.6],
			[1.5, 1.7, 2.0, 2.2, 2.5, 2.8, 3.1, 3.4, 4.0, 4.6, 5.3, 5.9, 6.7, 7.9, 9.0, 10.1],
			[1.4, 1.7, 1.9, 2.2, 2.4, 2.7, 3.0, 3.2, 3.8, 4.4, 5.0, 5.7, 6.4, 7.6, 8.6, 9.7],
			[1.4, 1.6, 1.8, 2.1, 2.3, 2.6, 2.8, 3.1, 3.6, 4.2, 4.8, 5.4, 6.0, 7.1, 8.1, 9.1],
			[1.3, 1.6, 1.8, 2.0, 2.3, 2.5, 2.8, 3.0, 3.6, 4.1, 4.7, 5.3, 6.0, 7.0, 8.0, 9.0],
			[1.3, 1.5, 1.8, 2.0, 2.2, 2.5, 2.7, 3.0, 3.5, 4.0, 4.6, 5.2, 5.8, 6.8, 7.8, 8.7],
			[1.3, 1.5, 1.7, 1.9, 2.2, 2.4, 2.7, 2.9, 3.4, 3.9, 4.5, 5.0, 5.6, 6.6, 7.6, 8.5],
			[1.3, 1.5, 1.7, 1.9, 2.2, 2.4, 2.6, 2.9, 3.4, 3.9, 4.4, 5.0, 5.6, 6.6, 7.5, 8.4],
			[1.3, 1.5, 1.7, 1.9, 2.1, 2.3, 2.6, 2.8, 3.3, 3.8, 4.3, 4.8, 5.4, 6.3, 7.2, 8.1],
			[1.2, 1.4, 1.6, 1.8, 2.0, 2.2, 2.4, 2.6, 3.1, 3.5, 4.0, 4.5, 5.0, 5.9, 6.6, 7.4],
			[1.1, 1.3, 1.5, 1.7, 1.9, 2.1, 2.3, 2.5, 2.9, 3.4, 3.8, 4.2, 4.7, 5.5, 6.2, 6.8],
			[1.1, 1.3, 1.4, 1.6, 1.8, 2.0, 2.2, 2.4, 2.8, 3.2, 3.6, 4.0, 4.4, 5.1, 5.7, 6.2],
			[1.0, 1.2, 1.3, 1.5, 1.6, 1.8, 2.0, 2.1, 2.5, 2.8, 3.1, 3.4, 3.7, 4.2, 4.6, 4.9],
			[ .9, 1.0, 1.1, 1.3, 1.4, 1.5, 1.6, 1.7, 2.0, 2.1, 2.3, 2.4, 2.5,   0,   0,   0],
			[ .8,  .9, 1.0, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7,   0,   0,   0,   0,   0,   0]
		]
	},
	'gt3_2mm': {
		'teeth': [12,14,16,18,20,22,24,26,28,30,34,38,45,50,56,62,74,80],
		'rpms': [10,20,40,60,100,200,300,400,500,600,800,1000,1200,1400,1600,1800,
				2000,2400,2800,3200,3600,4000,5000,6000,8000,10000,12000,14000],
		'width_multipliers': {'4mm': 0.60, '6mm': 1.00, '9mm': 1.64, '12mm': 2.32},
		'torques': [
			[0.88, 1.04, 1.19, 1.35, 1.51, 1.66, 1.81, 1.96, 2.11, 2.26, 2.55, 2.84, 3.33, 3.68, 4.09, 4.50, 5.30, 5.69],
			[0.80, 0.95, 1.10, 1.25, 1.39, 1.53, 1.67, 1.81, 1.95, 2.08, 2.35, 2.61, 3.07, 3.39, 3.76, 4.14, 4.86, 5.22],
			[0.73, 0.87, 1.01, 1.14, 1.27, 1.40, 1.53, 1.66, 1.78, 1.91, 2.15, 2.39, 2.80, 3.09, 3.44, 3.77, 4.43, 4.75],
			[0.69, 0.82, 0.95, 1.08, 1.20, 1.32, 1.45, 1.57, 1.69, 1.80, 2.03, 2.26, 2.65, 2.92, 3.24, 3.56, 4.18, 4.48],
			[0.64, 0.76, 0.88, 1.00, 1.12, 1.23, 1.34, 1.45, 1.56, 1.67, 1.89, 2.10, 2.46, 2.71, 3.00, 3.29, 3.86, 4.13],
			[0.57, 0.68, 0.79, 0.89, 1.00, 1.10, 1.20, 1.30, 1.40, 1.50, 1.69, 1.87, 2.19, 2.41, 2.67, 2.93, 3.42, 3.66],
			[0.53, 0.63, 0.73, 0.83, 0.93, 1.02, 1.12, 1.21, 1.30, 1.39, 1.57, 1.74, 2.04, 2.24, 2.48, 2.71, 3.17, 3.39],
			[0.50, 0.60, 0.70, 0.79, 0.88, 0.97, 1.06, 1.15, 1.24, 1.32, 1.49, 1.65, 1.93, 2.12, 2.34, 2.56, 2.99, 3.19],
			[0.48, 0.57, 0.66, 0.75, 0.84, 0.93, 1.02, 1.10, 1.18, 1.26, 1.42, 1.58, 1.84, 2.02, 2.24, 2.45, 2.85, 3.04],
			[0.46, 0.55, 0.64, 0.73, 0.81, 0.90, 0.98, 1.06, 1.14, 1.22, 1.37, 1.52, 1.77, 1.95, 2.15, 2.35, 2.73, 2.92],
			[0.43, 0.52, 0.60, 0.68, 0.76, 0.84, 0.92, 1.00, 1.07, 1.14, 1.29, 1.43, 1.66, 1.83, 2.02, 2.20, 2.55, 2.72],
			[0.41, 0.49, 0.57, 0.65, 0.73, 0.80, 0.88, 0.95, 1.02, 1.09, 1.22, 1.36, 1.58, 1.73, 1.91, 2.08, 2.41, 2.57],
			[0.39, 0.47, 0.55, 0.62, 0.70, 0.77, 0.84, 0.91, 0.98, 1.04, 1.17, 1.30, 1.51, 1.65, 1.82, 1.99, 2.30, 2.45],
			[0.37, 0.45, 0.53, 0.60, 0.67, 0.74, 0.81, 0.87, 0.94, 1.00, 1.13, 1.25, 1.45, 1.59, 1.75, 1.91, 2.20, 2.34],
			[0.36, 0.43, 0.51, 0.58, 0.65, 0.71, 0.78, 0.84, 0.91, 0.97, 1.09, 1.20, 1.40, 1.53, 1.69, 1.84, 2.12, 2.25],
			[0.35, 0.42, 0.49, 0.56, 0.63, 0.69, 0.76, 0.82, 0.88, 0.94, 1.05, 1.17, 1.35, 1.48, 1.63, 1.77, 2.04, 2.17],
			[0.34, 0.41, 0.48, 0.54, 0.61, 0.67, 0.73, 0.80, 0.85, 0.91, 1.02, 1.13, 1.31, 1.44, 1.58, 1.72, 1.98, 2.10],
			[0.32, 0.39, 0.45, 0.52, 0.58, 0.64, 0.70, 0.75, 0.81, 0.87, 0.97, 1.07, 1.24, 1.36, 1.49, 1.62, 1.86, 1.98],
			[0.30, 0.37, 0.43, 0.49, 0.55, 0.61, 0.67, 0.72, 0.77, 0.83, 0.93, 1.02, 1.19, 1.29, 1.42, 1.54, 1.76, 1.87],
			[0.29, 0.35, 0.41, 0.47, 0.53, 0.58, 0.64, 0.69, 0.74, 0.79, 0.89, 0.98, 1.13, 1.24, 1.36, 1.47, 1.68, 1.78],
			[0.28, 0.34, 0.40, 0.45, 0.51, 0.56, 0.62, 0.67, 0.71, 0.76, 0.85, 0.94, 1.09, 1.19, 1.30, 1.41, 1.60, 1.70],
			[0.27, 0.33, 0.38, 0.44, 0.49, 0.54, 0.59, 0.64, 0.69, 0.74, 0.82, 0.91, 1.05, 1.14, 1.25, 1.35, 1.54, 1.62],
			[0.24, 0.30, 0.35, 0.40, 0.45, 0.50, 0.55, 0.59, 0.64, 0.68, 0.76, 0.84, 0.96, 1.05, 1.14, 1.23, 1.39, 1.47],
			[0.23, 0.28, 0.33, 0.38, 0.42, 0.47, 0.51, 0.55, 0.59, 0.63, 0.71, 0.78, 0.89, 0.97, 1.05, 1.13, 1.27, 1.33],
			[0.20, 0.24, 0.29, 0.33, 0.37, 0.41, 0.45, 0.49, 0.52, 0.56, 0.62, 0.68, 0.78, 0.84, 0.91, 0.97, 1.07, 1.12],
			[0.17, 0.22, 0.26, 0.30, 0.34, 0.37, 0.41, 0.44, 0.47, 0.50, 0.56, 0.61, 0.69, 0.74, 0.79, 0.84, 0.91, 0.94],
			[0.15, 0.20, 0.23, 0.27, 0.30, 0.34, 0.37, 0.40, 0.42, 0.45, 0.50, 0.54, 0.61, 0.65, 0.70, 0.73, 0.77, 0.78],
			[0.14, 0.18, 0.21, 0.25, 0.28, 0.31, 0.34, 0.36, 0.39, 0.41, 0.45, 0.49, 0.55, 0.58, 0.61, 0.63, 0, 0]
		]
	},
	'gt3_3mm': {
		'teeth': [16,18,20,22,24,26,28,30,34,38,45,50,56,62,74,80],
		'rpms':  [10,20,40,60,100,200,300,400,500,600,800,1000,1200,1400,1600,1800,2000,2400,2800,3200,3600,4000,5000,6000,8000,10000,12000,14000],
		'width_multipliers': {'6mm': 1.00, '9mm': 1.64, '12mm': 2.32, '15mm': 3.03},
		'torques': [
			[2.08, 2.40, 2.72, 3.05, 3.36, 3.68, 4.00, 4.31, 4.92, 5.54, 6.60, 7.34, 8.23, 9.11, 10.8, 11.7],
			[1.93, 2.23, 2.54, 2.84, 3.14, 3.43, 3.73, 4.03, 4.61, 5.18, 6.18, 6.88, 7.71, 8.53, 10.2, 11.0],
			[1.78, 2.06, 2.35, 2.63, 2.91, 3.19, 3.47, 3.74, 4.29, 4.83, 5.75, 6.41, 7.18, 7.95, 9.46, 10.2],
			[1.69, 1.97, 2.24, 2.51, 2.78, 3.05, 3.32, 3.58, 4.10, 4.62, 5.51, 6.13, 6.87, 7.61, 9.05, 9.77],
			[1.58, 1.84, 2.10, 2.36, 2.62, 2.87, 3.12, 3.37, 3.87, 4.36, 5.20, 5.79, 6.49, 7.18, 8.54, 9.21],
			[1.43, 1.67, 1.91, 2.15, 2.39, 2.63, 2.86, 3.09, 3.55, 4.00, 4.77, 5.32, 5.96, 6.60, 7.85, 8.46],
			[1.34, 1.57, 1.80, 2.03, 2.26, 2.48, 2.71, 2.93, 3.36, 3.79, 4.53, 5.04, 5.65, 6.26, 7.44, 8.02],
			[1.28, 1.50, 1.73, 1.95, 2.17, 2.38, 2.60, 2.81, 3.23, 3.64, 4.35, 4.85, 5.44, 6.02, 7.15, 7.71],
			[1.23, 1.45, 1.67, 1.88, 2.09, 2.30, 2.51, 2.72, 3.13, 3.53, 4.22, 4.70, 5.27, 5.83, 6.93, 7.47],
			[1.19, 1.41, 1.62, 1.83, 2.03, 2.24, 2.44, 2.65, 3.04, 3.43, 4.11, 4.58, 5.13, 5.68, 6.75, 7.27],
			[1.13, 1.34, 1.54, 1.74, 1.94, 2.14, 2.34, 2.53, 2.91, 3.29, 3.93, 4.38, 4.91, 5.43, 6.46, 6.96],
			[1.08, 1.28, 1.48, 1.67, 1.87, 2.06, 2.25, 2.44, 2.81, 3.17, 3.79, 4.23, 4.74, 5.25, 6.23, 6.71],
			[1.04, 1.24, 1.43, 1.62, 1.81, 2.00, 2.18, 2.36, 2.72, 3.08, 3.68, 4.10, 4.60, 5.09, 6.05, 6.51],
			[1.01, 1.20, 1.39, 1.57, 1.76, 1.94, 2.12, 2.30, 2.65, 3.00, 3.59, 4.00, 4.48, 4.96, 5.89, 6.34],
			[0.98, 1.17, 1.35, 1.53, 1.72, 1.89, 2.07, 2.25, 2.59, 2.93, 3.51, 3.91, 4.38, 4.85, 5.75, 6.19],
			[0.95, 1.14, 1.32, 1.50, 1.68, 1.85, 2.03, 2.20, 2.54, 2.87, 3.43, 3.83, 4.29, 4.75, 5.63, 6.06],
			[0.93, 1.11, 1.29, 1.47, 1.64, 1.82, 1.99, 2.16, 2.49, 2.81, 3.37, 3.75, 4.21, 4.65, 5.52, 5.94],
			[0.89, 1.07, 1.24, 1.41, 1.58, 1.75, 1.92, 2.08, 2.40, 2.72, 3.25, 3.63, 4.07, 4.50, 5.33, 5.73],
			[0.86, 1.03, 1.20, 1.37, 1.53, 1.70, 1.86, 2.02, 2.33, 2.64, 3.16, 3.52, 3.94, 4.36, 5.16, 5.55],
			[0.83, 1.00, 1.16, 1.33, 1.49, 1.65, 1.81, 1.96, 2.27, 2.57, 3.07, 3.43, 3.84, 4.24, 5.01, 5.39],
			[0.80, 0.97, 1.13, 1.29, 1.45, 1.61, 1.76, 1.91, 2.21, 2.50, 3.00, 3.34, 3.74, 4.13, 4.88, 5.24],
			[0.78, 0.94, 1.10, 1.26, 1.42, 1.57, 1.72, 1.87, 2.16, 2.45, 2.93, 3.26, 3.65, 4.03, 4.76, 5.10],
			[0.73, 0.89, 1.04, 1.19, 1.34, 1.49, 1.63, 1.78, 2.05, 2.33, 2.78, 3.10, 3.46, 3.81, 4.48, 4.80],
			[0.69, 0.84, 0.99, 1.14, 1.28, 1.42, 1.56, 1.70, 1.96, 2.22, 2.66, 2.95, 3.30, 3.62, 4.23, 4.52],
			[0.63, 0.77, 0.91, 1.05, 1.18, 1.31, 1.44, 1.57, 1.82, 2.05, 2.45, 2.71, 3.01, 3.29, 3.78, 4.00],
			[0.57, 0.71, 0.84, 0.97, 1.10, 1.23, 1.35, 1.47, 1.69, 1.91, 2.26, 2.49, 2.75, 2.97, 0, 0],
			[0.53, 0.66, 0.79, 0.91, 1.03, 1.15, 1.26, 1.37, 1.58, 1.78, 2.09, 2.29, 0, 0, 0, 0],
			[0.50, 0.62, 0.74, 0.86, 0.97, 1.08, 1.19, 1.29, 1.48, 1.66, 1.93, 0, 0, 0, 0, 0]
		]
	},
	'gt3_5mm': {
		'teeth': [18,20,22,24,26,28,30,32,34,36,40,44,48,52,56,60,64,68,72,80],
		'rpms': [10,20,40,60,100,200,300,400,500,600,800,1000,1200,1400,1600,1800,2000,2400,2800,3200,3600,4000,5000,6000,8000,10000,12000,14000],
		'width_multipliers': {'9mm': 0.54, '15mm': 1.00, '20mm': 1.40, '25mm': 1.82},
		'torques': [
			[11.5, 13.7, 15.8, 18.0, 20.1, 22.3, 24.4, 26.5, 28.6, 30.8, 34.9, 39.1, 43.3, 47.4, 51.5, 55.6, 59.6, 63.7, 67.7, 75.7],
			[10.7, 12.8, 14.8, 16.9, 19.0, 21.0, 23.1, 25.1, 27.1, 29.1, 33.1, 37.1, 41.1, 45.0, 49.0, 52.9, 56.7, 60.6, 64.5, 72.1],
			[9.85, 11.9, 13.9, 15.8, 17.8, 19.8, 21.7, 23.7, 25.6, 27.5, 31.3, 35.2, 38.9, 42.7, 46.4, 50.2, 53.9, 57.6, 61.2, 68.5],
			[9.38, 11.3, 13.3, 15.2, 17.1, 19.0, 20.9, 22.8, 24.7, 26.6, 30.3, 34.0, 37.7, 41.3, 45.0, 48.6, 52.2, 55.8, 59.3, 66.4],
			[8.78, 10.7, 12.6, 14.4, 16.3, 18.1, 19.9, 21.8, 23.6, 25.4, 29.0, 32.5, 36.1, 39.6, 43.1, 46.6, 50.1, 53.5, 56.9, 63.8],
			[7.98, 9.77, 11.6, 13.3, 15.1, 16.8, 18.6, 20.3, 22.0, 23.8, 27.2, 30.6, 33.9, 37.3, 40.6, 43.9, 47.2, 50.5, 53.7, 60.2],
			[7.50, 9.24, 11.0, 12.7, 14.4, 16.1, 17.8, 19.5, 21.1, 22.8, 26.1, 29.4, 32.7, 35.9, 39.1, 42.3, 45.5, 48.7, 51.8, 58.1],
			[7.17, 8.87, 10.6, 12.3, 13.9, 15.6, 17.2, 18.9, 20.5, 22.1, 25.4, 28.6, 31.8, 34.9, 38.1, 41.2, 44.3, 47.4, 50.5, 56.6],
			[6.91, 8.58, 10.3, 11.9, 13.5, 15.2, 16.8, 18.4, 20.0, 21.6, 24.8, 27.9, 31.1, 34.2, 37.3, 40.3, 43.4, 46.4, 49.4, 55.4],
			[6.69, 8.34, 9.99, 11.6, 13.2, 14.8, 16.4, 18.0, 19.6, 21.2, 24.3, 27.4, 30.5, 33.6, 36.6, 39.6, 42.6, 45.6, 48.6, 54.5],
			[6.36, 7.97, 9.58, 11.2, 12.7, 14.3, 15.9, 17.4, 19.0, 20.5, 23.6, 26.6, 29.6, 32.6, 35.5, 38.5, 41.4, 44.3, 47.2, 52.9],
			[6.10, 7.68, 9.26, 10.8, 12.4, 13.9, 15.5, 17.0, 18.5, 20.0, 23.0, 26.0, 28.9, 31.8, 34.7, 37.6, 40.5, 43.3, 46.1, 51.7],
			[5.88, 7.44, 9.00, 10.5, 12.1, 13.6, 15.1, 16.6, 18.1, 19.6, 22.5, 25.4, 28.3, 31.2, 34.0, 36.9, 39.7, 42.5, 45.2, 50.7],
			[5.70, 7.24, 8.78, 10.3, 11.8, 13.3, 14.8, 16.3, 17.7, 19.2, 22.1, 25.0, 27.8, 30.6, 33.5, 36.2, 39.0, 41.7, 44.5, 49.9],
			[5.55, 7.07, 8.59, 10.1, 11.6, 13.0, 14.5, 16.0, 17.4, 18.9, 21.7, 24.6, 27.4, 30.2, 32.9, 35.7, 38.4, 41.1, 43.8, 49.1],
			[5.41, 6.91, 8.42, 9.90, 11.4, 12.8, 14.3, 15.7, 17.2, 18.6, 21.4, 24.2, 27.0, 29.8, 32.5, 35.2, 37.9, 40.5, 43.2, 48.4],
			[5.28, 6.78, 8.27, 9.74, 11.2, 12.6, 14.1, 15.5, 16.9, 18.3, 21.1, 23.9, 26.7, 29.4, 32.1, 34.7, 37.4, 40.0, 42.6, 47.7],
			[5.07, 6.54, 8.00, 9.45, 10.9, 12.3, 13.7, 15.1, 16.5, 17.9, 20.6, 23.4, 26.0, 28.7, 31.3, 33.9, 36.5, 39.1, 41.6, 46.6],
			[4.89, 6.33, 7.78, 9.20, 10.6, 12.0, 13.4, 14.8, 16.1, 17.5, 20.2, 22.9, 25.5, 28.1, 30.7, 33.2, 35.7, 38.2, 40.7, 45.5],
			[4.73, 6.15, 7.58, 8.98, 10.4, 11.7, 13.1, 14.5, 15.8, 17.2, 19.8, 22.4, 25.0, 27.6, 30.1, 32.6, 35.0, 37.4, 39.8, 44.5],
			[4.58, 6.00, 7.41, 8.79, 10.2, 11.5, 12.9, 14.2, 15.5, 16.9, 19.5, 22.0, 24.6, 27.1, 29.5, 32.0, 34.3, 36.7, 39.0, 43.5],
			[4.46, 5.85, 7.25, 8.62, 9.97, 11.3, 12.7, 14.0, 15.3, 16.6, 19.1, 21.7, 24.2, 26.6, 29.0, 31.4, 33.7, 36.0, 38.2, 42.6],
			[4.18, 5.55, 6.90, 8.24, 9.55, 10.9, 12.2, 13.4, 14.7, 16.0, 18.4, 20.8, 23.2, 25.5, 27.8, 30.0, 32.2, 34.3, 36.3, 0],
			[3.95, 5.29, 6.61, 7.91, 9.20, 10.5, 11.7, 13.0, 14.2, 15.4, 17.8, 20.1, 22.3, 24.5, 26.7, 28.7, 30.7, 0, 0, 0],
			[3.58, 4.86, 6.13, 7.37, 8.59, 9.79, 11.0, 12.1, 13.3, 14.4, 16.6, 18.7, 20.7, 0, 0, 0, 0, 0, 0, 0],
			[3.26, 4.50, 5.71, 6.90, 8.05, 9.18, 10.3, 11.4, 12.4, 13.5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[2.99, 4.17, 5.33, 6.46, 7.55, 8.61, .641, 0.6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[2.73, 3.87, 4.97, 6.04, 7.06, 8.04, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
		]
	},
	'gt2_3mm': {
		'teeth': [16,18,20,22,24,28,30,34,38,45,50,56,62,74,80],
		'rpms': [10,20,40,60,100,200,300,400,500,600,800,1000,1200,1400,1600,1800,2000,2400,2800,3200,3600,4000,5000,6000,8000,10000,12000,14000],
		'width_multipliers': {'6mm': 1.00, '9mm': 1.50, '12mm': 2.00, '15mm': 2.50},
		'torques': [
			[1.58, 1.84, 2.09, 2.34, 2.59, 2.83, 3.32, 3.80, 4.27, 5.09, 5.66, 6.34, 7.02, 8.35, 9.00],
			[1.45, 1.69, 1.92, 2.15, 2.38, 2.61, 3.06, 3.51, 3.95, 4.71, 5.24, 5.87, 6.49, 7.72, 8.32],
			[1.31, 1.53, 1.75, 1.97, 2.18, 2.39, 2.81, 3.22, 3.63, 4.33, 4.82, 5.40, 5.97, 7.09, 7.65],
			[1.23, 1.44, 1.65, 1.86, 2.06, 2.26, 2.66, 3.05, 3.44, 4.10, 4.57, 5.12, 5.66, 6.73, 7.25],
			[1.13, 1.33, 1.53, 1.72, 1.91, 2.10, 2.47, 2.84, 3.20, 3.82, 4.26, 4.77, 5.27, 6.26, 6.75],
			[1.00, 1.18, 1.36, 1.53, 1.71, 1.88, 2.22, 2.55, 2.88, 3.44, 3.83, 4.29, 4.75, 5.64, 6.07],
			[0.92, 1.09, 1.26, 1.42, 1.59, 1.75, 2.07, 2.38, 2.69, 3.22, 3.58, 4.02, 4.44, 5.27, 5.68],
			[0.86, 1.03, 1.19, 1.35, 1.50, 1.66, 1.97, 2.26, 2.56, 3.06, 3.41, 3.82, 4.22, 5.01, 5.39],
			[0.82, 0.98, 1.13, 1.29, 1.44, 1.59, 1.88, 2.17, 2.45, 2.94, 3.27, 3.67, 4.05, 4.81, 5.17],
			[0.78, 0.94, 1.09, 1.24, 1.39, 1.53, 1.82, 2.10, 2.37, 2.84, 3.16, 3.54, 3.92, 4.64, 4.99],
			[0.73, 0.87, 1.02, 1.16, 1.30, 1.44, 1.71, 1.98, 2.24, 2.68, 2.98, 3.34, 3.70, 4.38, 4.71],
			[0.68, 0.82, 0.96, 1.10, 1.24, 1.37, 1.63, 1.88, 2.13, 2.55, 2.85, 3.19, 3.53, 4.17, 4.49],
			[0.65, 0.78, 0.92, 1.05, 1.18, 1.31, 1.56, 1.81, 2.05, 2.45, 2.73, 3.06, 3.39, 4.01, 4.31],
			[0.62, 0.75, 0.88, 1.01, 1.14, 1.26, 1.51, 1.74, 1.97, 2.37, 2.64, 2.96, 3.27, 3.86, 4.15],
			[0.59, 0.72, 0.85, 0.97, 1.10, 1.22, 1.46, 1.69, 1.91, 2.29, 2.56, 2.86, 3.16, 3.74, 4.02],
			[0.57, 0.69, 0.82, 0.94, 1.06, 1.18, 1.41, 1.64, 1.86, 2.23, 2.48, 2.78, 3.07, 3.63, 3.89],
			[0.55, 0.67, 0.79, 0.91, 1.03, 1.15, 1.37, 1.59, 1.81, 2.17, 2.42, 2.71, 2.99, 3.53, 3.78],
			[0.51, 0.63, 0.75, 0.86, 0.98, 1.09, 1.31, 1.52, 1.72, 2.06, 2.30, 2.58, 2.84, 3.35, 3.59],
			[0.48, 0.60, 0.71, 0.82, 0.93, 1.04, 1.25, 1.45, 1.65, 1.98, 2.20, 2.46, 2.72, 3.19, 3.42],
			[0.45, 0.57, 0.68, 0.79, 0.89, 1.00, 1.20, 1.39, 1.58, 1.90, 2.12, 2.36, 2.60, 3.06, 3.27],
			[0.43, 0.54, 0.65, 0.75, 0.86, 0.96, 1.15, 1.34, 1.53, 1.83, 2.04, 2.28, 2.50, 2.93, 3.13],
			[0.41, 0.52, 0.62, 0.73, 0.83, 0.92, 1.11, 1.30, 1.47, 1.77, 1.97, 2.19, 2.41, 2.81, 3.00],
			[0.37, 0.47, 0.57, 0.66, 0.76, 0.85, 1.03, 1.20, 1.36, 1.63, 1.81, 2.01, 2.20, 2.55, 2.70],
			[0.33, 0.43, 0.52, 0.61, 0.70, 0.79, 0.96, 1.11, 1.27, 1.51, 1.67, 1.85, 2.02, 2.30, 2.42],
			[0.27, 0.36, 0.45, 0.53, 0.61, 0.69, 0.84, 0.97, 1.10, 1.31, 1.44, 1.57, 1.68, 1.84, 1.88],
			[0.22, 0.31, 0.39, 0.46, 0.54, 0.61, 0.74, 0.86, 0.97, 1.13, 1.22, 1.30, 1.36, 0.00, 0.00],
			[0.19, 0.26, 0.34, 0.41, 0.47, 0.53, 0.65, 0.75, 0.84, 0.95, 1.01, 0.00, 0.00, 0.00, 0.00],
			[0.15, 0.22, 0.29, 0.35, 0.41, 0.47, 0.57, 0.65, 0.72, 0.79, 0.00, 0.00, 0.00, 0.00, 0.00]
		]
	},
	'gt2_5mm': {
		'teeth': [18,20,22,24,26,28,32,36,40,45,50,56,62,74,80],
		'rpms':  [10,20,40,60,100,200,300,400,500,600,800,1000,1200,1400,1600,1800,2000,2400,2800,3200,3600,4000,5000,6000,8000,10000,12000,14000],
		'width_multipliers': {'9mm':0.60, '15mm':1.00, '20mm':1.33, '25mm': 1.67},
		'torques': [
			[10, 8.84, 10.58, 12.32, 14.03, 15.74, 17.44, 20.83, 24.19, 27.52, 30.84, 35.77, 40.67, 45.54, 55.17, 59.95],
			[20, 8.18, 9.84, 11.51, 13.15, 14.78, 16.41, 19.65, 22.87, 26.05, 29.22, 33.94, 38.61, 43.26, 52.45, 57.01],
			[40, 7.52, 9.11, 10.70, 12.27, 13.83, 15.38, 18.48, 21.55, 24.58, 27.60, 32.10, 36.55, 40.98, 49.73, 54.07],
			[60, 7.13, 8.68, 10.23, 11.75, 13.27, 14.78, 17.79, 20.77, 23.72, 26.66, 31.03, 35.35, 39.65, 48.14, 52.35],
			[100, 6.64, 8.14, 9.63, 11.10, 12.57, 14.02, 16.92, 19.80, 22.64, 25.47, 29.67, 33.83, 37.97, 46.14, 50.18],
			[200, 5.98, 7.40, 8.82, 10.22, 11.61, 12.99, 15.75, 18.48, 21.17, 23.85, 27.83, 31.78, 35.69, 43.42, 47.24],
			[300, 5.59, 6.97, 8.38, 9.71, 11.05, 12.39, 15.06, 17.70, 20.31, 22.90, 26.76, 30.57, 34.35, 41.82, 45.51],
			[400, 5.32, 6.67, 8.01, 9.34, 10.66, 11.96, 14.57, 17.15, 19.70, 22.23, 25.99, 29.71, 33.40, 40.68, 44.27],
			[500, 5.11, 6.43, 7.75, 9.05, 10.35, 11.63, 14.19, 16.72, 19.22, 21.71, 25.40, 29.04, 32.66, 39.79, 43.31],
			[600, 4.93, 6.24, 7.54, 8.82, 10.10, 11.36, 13.88, 16.37, 18.83, 21.28, 24.91, 28.49, 32.05, 39.05, 42.51],
			[800, 4.66, 5.93, 7.20, 8.45, 9.70, 10.93, 13.39, 15.82, 18.21, 20.60, 24.13, 27.62, 31.07, 37.88, 41.23],
			[1000, 4.44, 5.69, 6.94, 8.17, 9.39, 10.60, 13.01, 15.39, 17.73, 20.06, 23.52, 26.93, 30.30, 36.94, 40.21],
			[1200, 4.27, 5.50, 6.73, 7.93, 9.13, 10.32, 12.69, 15.03, 17.33, 19.62, 23.01, 26.36, 29.66, 36.15, 39.34],
			[1400, 4.12, 5.33, 6.54, 7.73, 8.92, 10.09, 12.42, 14.73, 16.99, 19.24, 22.58, 25.86, 29.10, 35.46, 38.58],
			[1600, 3.99, 5.19, 6.39, 7.56, 8.73, 9.89, 12.19, 14.46, 16.69, 18.91, 22.19, 25.42, 28.61, 34.84, 37.89],
			[1800, 3.88, 5.06, 6.24, 7.41, 8.56, 9.71, 11.98, 14.22, 16.43, 18.61, 21.85, 25.02, 28.15, 34.26, 37.24],
			[2000, 3.78, 4.95, 6.12, 7.27, 8.41, 9.54, 11.79, 14.01, 16.18, 18.34, 21.53, 24.65, 27.73, 33.72, 36.63],
			[2400, 3.60, 4.75, 5.90, 7.03, 8.15, 9.26, 11.46, 13.62, 15.75, 17.85, 20.95, 23.98, 26.96, 32.71, 35.49],
			[2800, 3.45, 4.58, 5.71, 6.82, 7.92, 9.01, 11.17, 13.29, 15.37, 17.42, 20.44, 23.38, 26.25, 31.76, 34.39],
			[3200, 3.31, 4.43, 5.54, 6.64, 7.72, 8.79, 10.91, 12.99, 15.02, 17.02, 19.96, 22.80, 25.57, 30.83, 33.32],
			[3600, 3.19, 4.30, 5.39, 6.47, 7.54, 8.59, 10.67, 12.71, 14.70, 16.65, 19.51, 22.26, 24.91, 29.91, 32.24],
			[4000, 3.09, 4.17, 5.26, 6.32, 7.37, 8.41, 10.45, 12.45, 14.40, 16.30, 19.07, 21.72, 24.27, 28.99, 31.15],
			[5000, 2.85, 3.91, 4.96, 5.98, 7.00, 7.99, 9.95, 11.85, 13.68, 15.46, 18.01, 20.41, 22.64, 26.60, 0],
			[6000, 2.65, 3.68, 4.70, 5.69, 6.66, 7.62, 9.49, 11.29, 13.01, 14.65, 16.96, 19.06, 20.96, 0, 0],
			[8000, 2.31, 3.28, 4.24, 5.16, 6.06, 6.94, 8.62, 10.20, 11.65, 12.99, 14.75, 0, 0, 0, 0],
			[10000, 2.01, 2.92, 3.82, 4.67, 5.49, 6.28, 7.76, 9.08, 0, 0, 0, 0, 0, 0, 0],
			[12000, 1.73, 2.59, 3.41, 4.19, 4.92, 5.61, 6.85, 0, 0, 0, 0, 0, 0, 0, 0],
			[14000, 1.45, 2.25, 3.00, 3.69, 4.33, 4.91, 0, 0, 0, 0, 0, 0, 0, 0, 0]
		]
	}
}