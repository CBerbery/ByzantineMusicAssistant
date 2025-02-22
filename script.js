/* 
Developped by Charles Berbery 2021 
*/

var filterOn
// Global variables declarations
// HTML Collections
let inputIntervalsCollection
let noteKeyCollection
let plusMinusCollection
let fthorasCollection
let presetBtnsCollection
let radioFineTuneBase

const KEYB_KEYS 	  = ['z', 'x', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'", 'o', 'p', '[', ']']
const KEYB_KEYS_SHIFT = ['Z', 'X', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ':', '"', 'O', 'P', '{', '}']

//this variable stores how many keys are playing at same time
//this will be used to prevent setting base note when more than one key is pressed
var numberOfKeysAtTheSameTime = 0 

// Scales intervals from Dhi-2 to dhi+2 this extends range by 6 intervals up and 6 intervals down
// used range is gha-1 to ke+1 extended range is used for offsetting scale
//in total the extended scale shoud have 28 intervals
//12 for extension and 16 for main scale
//                        dhi ke  zo  ni  pa vou GHA dhi ke   zo NI  pa  vou gha dhi ke  zo  ni  pa vou gha dhi ke  zo  ni  pa vou gha dhi
const naturalScale 		 = [12, 12,  6, 12, 12, 6, 12, 12, 12,  6, 12, 12,  6, 12, 12, 12,  6, 12, 12, 6, 12, 12, 12,  6, 12, 12, 6, 12]
const diatonicScale      = [12, 10,  8, 12, 10, 8, 12, 12, 10,  8, 12, 10,  8, 12, 12, 10,  8, 12, 10, 8, 12, 12, 10,  8, 12, 10, 8, 12]
const specialScale       = [ 0,  0,  0,  0,  0, 0,  0,  0,  0,  8, 12, 10,  8, 12, 12,  6, 12, 12,  0, 0,  0,  0,  0,  0,  0,  0, 0,  0]
const enharmonicScale    = [12,  6, 12, 12, 12, 6, 12, 12,  6, 12, 12, 12,  6, 12, 12,  6, 12, 12, 12, 6, 12, 12,  6, 12, 12, 12, 6, 12]
const enharmonicScaleZo  = [12,  6, 12, 12,  6,12, 12, 12,  6, 12, 12,  6, 12, 12, 12,  6, 12, 12,  6,12, 12, 12,  6, 12, 12,  6,12, 12]
const klitonScale        = [ 0,  0,  0,  0,  0, 0,  0,  0,  0,  0, 12, 14, 12,  4, 12, 10,  8,  0,  0, 0,  0,  0,  0,  0,  0,  0, 0,  0]
const zygosScale         = [ 0,  0,  0,  0,  0, 0,  0,  0,  0,  0, 18,  4, 16,  4, 12, 10,  8, 12,  0, 0,  0,  0,  0,  0,  0,  0, 0,  0]
const spathiScale        = [ 0,  0,  0,  0,  0, 0,  0,  0,  0,  0,  0, 10,  8, 20,  4,  4, 14, 12,  0, 0,  0,  0,  0,  0,  0,  0, 0,  0]
const hardChromaticScale = [ 0,  0,  0,  0,  0, 0,  0,  0,  0,  8, 12,  6, 20,  4, 12,  6, 20,  4,  0, 0,  0,  0,  0,  0,  0,  0, 0,  0]
const softChromaticScale = [ 0,  0,  0,  0,  0, 0,  0,  0,  0,  0,  8, 14,  8, 12,  8, 14,  8, 12, 10, 0,  0,  0,  0,  0,  0,  0, 0,  0]

//note that < and > are special characters in HTML and usually cannot be used as is should use &#60; for < and &#62; for >
//but since we are using an unusual font which is ez psaltica and ez special-i this is not necessary, 
//because already < and > already yield different characters inside the font!
const extendedNoteNames      = ['Dhi', 'Ke', 'Zo', 'Ni', 'Pa', 'Vou', 'Gha','Dhi', 'Ke', 'Zo', 'Ni', 'Pa', 'Vou', 'Gha', 'Dhi', 'Ke', 'Zo', 'Ni', 'Pa', 'Vou', 'Gha', 'Dhi', 'Ke', 'Zo', 'Ni', 'Pa', 'Vou', 'Gha','Dhi']
const martyriaDiatonic       = [  'C',  'V',  '>',  'C',  'V',   'B',   'N',  'C',  'V',  '>',  'C',  'V',   'B',   'N',  '<C', '<V',  'B',  'N',  'V',   'B',   'N',  '<C', '<V',  'B',  'N',  'V',   'B',   'N', '<C']
const martyriaSpecial        = [  'C',  'V',  '>',  'C',  'V',   'B',   'N',  'C',  'V',  '>',  'C',  'V',   'B',   'N',  '<C', '<V',  'N',  'N',  'V',   'B',   'N',  '<C', '<V',  'B',  'N',  'V',   'B',   'N', '<C']
const martyiraEnharmonicGha  = [  'C',  'V',  'N',  'C',  'V',   'B',   'N',  'C',  'V',  'N',  'C',  'V',   'B',   'N',  '<C', '<V',  'N',  'N',  'V',   'B',   'N',  '<C', '<V',  'N',  'N',  'V',   'B',   'N', '<C']
const martyiraEnharmonicGha2 = [  'V',  'N',  'C',  'V',  'N',   'C',   'V',  'N',  'C',  'V',  'N', '<C',  '<V',   'N',  '<C', '<V',  'N', '<C', '<V',   'N',  '<C',  '<V',  'N', '<C', '<V',  'N',  '<C',  '<V',  'N']
const martyiraEnharmonicZo   = [  'N',  'C',  'V',  'N',  'C',   'V',   'N',  'C',  'V',  'N',  'C',  'V',   'N',   'N',  '<C', '<V',  'N', '<C', '<V',   'N',  '<C',  '<V',  'N', '<C', '<V',  'N',  '<C',   'V',  'N']
const martyriaKliton         = [  'C',  'V',  '>',  'C',  'V',   'B',   'N',  'C',  'V',  '>',  'C',  'C',   'V',   'B',   'N', '<V',  'B',  'N',  'V',   'B',   'N',  '<C', '<V',  'B',  'N',  'V',   'B',   'N', '<C']
const martyriaZygos          = [  'C',  'V',  '>',  'C',  'V',   'B',   'N',  'C',  'V',  '>',  'C',  '?',   'I',   '?',   'I', '<V',  'B',  'N',  'V',   'B',   'N',  '<C', '<V',  'B',  'N',  'V',   'B',   'N', '<C']
const martyriaSpathi         = [  'C',  'V',  '>',  'C',  'V',   'B',   'N',  'C',  'V',  '>',  'C',  'V',   'B',   'N',   '?', '<V',  'N', '<C',  'V',   'B',   'N',  '<C', '<V',  'B',  'N',  'V',   'B',   'N', '<C']
const martyriaHardChromatic  = [  'M',  '?',  'M',  '?',  'M',   '?',   'M',  '?',  'M',  '?',  'M',  '?',   'M',   '?',   'M',  '?',  'M',  '?',  'M',   '?',   'M',   '?',  'M',  '?',  'M',  '?',   'M',   '?',  'M']
const martyriaSoftChromatic  = [ '<?',  'R', '<?',  'R', '<?',   'R',  '<?',  'R', '<?',  'R', '<?',  'R',  '<?',   'R',  '<?',  'R', '<?',  'R', '<?',   'R',  '<?',   'R', '<?',  'R', '<?',  'R',  '<?',   'R', '<?']

//
let naturalFrequencies = new Array(17)
let actualFrequencies = new Array(17)
let baseFrequency = 220 //initiated to ke-1
let baseNoteIndex = 4 //set base note to natural ni
let fthoraIndex = 0  //set base fthora diatonic ni

//Create Audio Context
var AudioContext = window.AudioContext || window.webkitAudioContext;
var audioCtx = new AudioContext();
var oscillatorsCollection = new Array(17)
var gainCollection = new Array(17)
var convolver = audioCtx.createConvolver();
var biquadFilter = audioCtx.createBiquadFilter();
var node = audioCtx.createGain()
var dry = audioCtx.createGain()
var wet = audioCtx.createGain()
var output = audioCtx.createGain()
var hornTable

var timeoutID

var organ = {"real":[0,0,-0.042008,0.010474,-0.138038,0.002641,-0.001673,0.001039,-0.021054,0.000651,-0.000422,0.000334,-0.000236,0.000191,-0.000161,0.000145,-0.018478,0.000071,-0.000066,0.000047,-0.000044,0.000041,-0.000034,0.000031,-0.00003,0.000028,-0.000025,0.000024,-0.000022,0.00002,-0.000015,0.000013,-0.01157,0.000004,-0.000003,0.000003,-0.000003,0.000003,-0.000003,0.000002,-0.000002,0.000002,-0.000002,0.000002,-0.000002,0.000002,-0.000002,0.000002,-0.000001,0.000001,-0.000001,0.000001,0,0,0,0,0,0,0,0,0,0,0,0,-0.000898,0.000001,-0.000001,0.000001,-0.000001,0.000001,-0.000001,0.000001,-0.000001,0.000001,-0.000001,0.000001,-0.000001,0.000001,-0.000001,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-0.000245,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-0.000106,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-0.000003,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			"imag":[0,0.196487,0,0,-0.000003,0,0,0,-0.000002,0,0,0,0,0,0,0,-0.000007,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-0.000018,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-0.000006,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-0.000006,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-0.00001,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-0.000001,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]}

//FIRST check that page is done loading if not wait until it is loaded
if (document.readystate == 'loading') {
	document.addEventListener('DOMContentLoaded', ready)
} else {
	createWave(organ)
	main()
	//read json file for sound parameters to create periodic wave of the sound
	/*var patchName = "/patches/" + "organ2" + ".json"
	fetch(patchName, {mode: 'no-cors'})
		.then(response => {return response.json();})
		.then(data => {	
			createWave(data)
			main()
	});*/
}

//THEN add event listeners to all items
function main () {
	inputIntervalsCollection = document.getElementsByClassName("interval")
	noteKeyCollection = document.getElementsByClassName("noteKey")
	plusMinusCollection = document.getElementsByClassName("plusMinus")
	fthorasCollection = document.getElementsByClassName("fthora")
	presetBtnsCollection = document.getElementsByClassName("presetBtn")
	radioFineTuneBase = document.querySelectorAll('input[type=radio][name="fineTuneBase"]')

	// initialize
	initialize()
	
	var i

	//add event listener to intervals
	for (i=0;i<inputIntervalsCollection.length;i++) {
		inputIntervalsCollection[i].addEventListener('change',inputIntervalChanged)
	}

	//add 2 event listeners to notes
	//mouse down: play noteset base note if set time exceeded
	//mouse up: stop note
	for (i=0;i<noteKeyCollection.length;i++) {
	
		noteKeyCollection[i].addEventListener('mousedown',e => {
			const keyIndex = getIndexInsideParent(e.target)
			e.target.classList.add('noteKeyPlayed')
			if (e.ctrlKey) {
				document.querySelector('#ctrlKey').classList.add('used')
				if (numberOfKeysAtTheSameTime = 1) setBaseNote(keyIndex)
			}
			if (!e.target.classList.contains('noteKeyDisabled')) playNote(keyIndex,e)
		})

		noteKeyCollection[i].addEventListener('mouseleave',e => {
			const keyIndex = getIndexInsideParent(e.target)
			document.querySelector('#ctrlKey').classList.remove('used')
			if (keyIndex == -1) return
			if (noteKeyCollection[keyIndex].classList.contains('noteKeyPlayed')) {
				noteKeyCollection[keyIndex].classList.remove('noteKeyPlayed')
				if (!noteKeyCollection[keyIndex].classList.contains('noteKeyDisabled')) stopNote(keyIndex)
			}
		})

		noteKeyCollection[i].addEventListener('mouseup',e => {
			const keyIndex = getIndexInsideParent(e.target)
			document.querySelector('#ctrlKey').classList.remove('used')
			document.querySelector('#shiftKey').classList.remove('used')
			document.querySelector('#altKey').classList.remove('used')
			if (keyIndex == -1) return
			if (noteKeyCollection[keyIndex].classList.contains('noteKeyPlayed')) {
				noteKeyCollection[keyIndex].classList.remove('noteKeyPlayed')
				if (!noteKeyCollection[keyIndex].classList.contains('noteKeyDisabled')) stopNote(keyIndex)
			}
		})
	}

	//add event listener for keyboard input
	document.addEventListener('keydown' , e=> {
		//important note for keyboard events
		//In order to save money, keyboard manufacturers often put many keys on the same "circuit" of sorts within the wiring of the keyboard. 
		//This prevents multiple keys in the same region of the keyboard from being pressed simultaneously. 
		//Sometimes it even prevents more than 2 keys at all from across the whole keyboard being pressed at once. 
		//Often the shift, ctrl, and alt keys are not within this limitation, so you can hold shift and press 2 other keys at once 
		//and it will still work fine.

		//a key pressed and not released fires series of keydown events
		//.repeat prevent repeating notes if key is pressed and not released
		if (e.repeat) return
		
		//.preventDefault() is a life saver it prevents the default browser shortcuts be launched!!!
		//this will enable using any key combination without launching browser actions!!!
		//except ctrl+n seems to be always triggered but it is ok since we are not using it to play notes!!
		if (e.ctrlKey || e.shiftKey || e.altKey) e.preventDefault()

		//keys change when shift is pressed that's why we have 2 key arrays
		const keyIndex = e.shiftKey? KEYB_KEYS_SHIFT.indexOf(e.key) : KEYB_KEYS.indexOf(e.key)
		if (keyIndex > -1) {
			if (noteKeyCollection[keyIndex].classList.contains('noteKeyPlayed')) {
				return
			} else {
				noteKeyCollection[keyIndex].classList.add('noteKeyPlayed')
			}
			
			if (e.ctrlKey) {
				document.querySelector('#ctrlKey').classList.add('used')
				setBaseNote(keyIndex)
			}
			
			if (!noteKeyCollection[keyIndex].classList.contains('noteKeyDisabled')) playNote(keyIndex,e)
		}	
	})

	document.addEventListener('keyup', e=> {
		//keys change when shift is pressed that's why we have 2 key arrays
		const keyIndex = e.shiftKey? KEYB_KEYS_SHIFT.indexOf(e.key) : KEYB_KEYS.indexOf(e.key)
		document.querySelector('#ctrlKey').classList.remove('used')
		document.querySelector('#shiftKey').classList.remove('used')
		document.querySelector('#altKey').classList.remove('used')
		if (keyIndex == -1) return
		if (noteKeyCollection[keyIndex].classList.contains('noteKeyPlayed')) noteKeyCollection[keyIndex].classList.remove('noteKeyPlayed')
		if (!noteKeyCollection[keyIndex].classList.contains('noteKeyDisabled')) stopNote(keyIndex)
	})

	//add event listener to plus minus buttons
	for (i=0;i<plusMinusCollection.length;i++) {
		plusMinusCollection[i].addEventListener('click',plusMinusPressed)
	}

	//add event listener to fthoras
	for (i=0;i<fthorasCollection.length;i++) {
		fthorasCollection[i].addEventListener('click',setFthora)
	}

	//add event listener to transpose
	document.getElementById('transposeInput').addEventListener('change', event => {
		//note transposition is actually handled in updateActualFrequencies
		//here only validity is checkd
		let transpose = event.target
		let validityState = transpose.validity
		
		if (!validityState.valid) {transpose.value = 0}
		updateActualFrequencies()
	})
	
	//Reset button event listener is included in HTML

	//add event listener to fineTuneBase radio input
	//used another method learned recently
	Array.prototype.forEach.call(radioFineTuneBase, radioItem => {
		radioItem.addEventListener('change', ()=> {updateActualFrequencies()})
	})
	//add event listener to preset buttons
	var i
	for (i=0; i<presetBtnsCollection.length; i++) {
		presetBtnsCollection[i].addEventListener('click',activatePreset)
	}
}


/////////////////////////////////////////////////////
function stopNote (noteIndex) {
	var timeInMilliseconds = 8
	var timeInSeconds = timeInMilliseconds/1000

	numberOfKeysAtTheSameTime -= 1

	//IMPORTANT:
	//---------
	//exponential and linear ramp start from the time of previous previous scheduled parameter value to the given value
	//so it necessary to first set the gain with an automation method before using the ramping function
	//----------
	gainCollection[noteIndex].gain.value = 0.5
	gainCollection[noteIndex].gain.linearRampToValueAtTime(0.00001, audioCtx.currentTime + timeInSeconds)

	timeoutID = setTimeout (() => {
			oscillatorsCollection[noteIndex].stop() 
			oscillatorsCollection[noteIndex] = undefined
			gainCollection[noteIndex] = undefined
		},timeInMilliseconds + 1)
}
///////////////////////////////////////////////////////////

function activatePreset (event) {
	//preset buttons combine fthoras and base notes in them
	var index = getIndexInsideParent(event.target)
	var genre, fthora, baseNote, baseIndex

	fthorasCollection[fthoraIndex].style.filter = "invert(0%)"
 
	switch (index) {
		case 1: //mode 1
			baseIndex = 5; fthoraIndex = 1;
			break
		case 2: //mode 2
			baseIndex = 8; fthoraIndex = 10;
			break
		case 3: //mode 3
			baseIndex = 7; fthoraIndex = 16;
			break
		case 4: //mode 4
			baseIndex = 6; fthoraIndex = 2;
			break
		case 5: //mode 5
			baseIndex = 9; fthoraIndex = 5;
			break
		case 6: //mode 6
			baseIndex = 5; fthoraIndex = 8;
			break
		case 7: //mode 7
			baseIndex = 7; fthoraIndex = 17;
			break
		case 8: //mode 8
			baseIndex = 4; fthoraIndex = 0;
			break
	}

	setFthora(fthoraIndex)
	setBaseNote(baseIndex)
}

function initialize() {
	//initialize natural frequencies (natural enharmonic scale)
	var i,j
	naturalFrequencies[0] = 220 * 2**(-24/72) //frequency of gha-1 from ke 220Hz
	for (i=1;i<actualFrequencies.length;i++) {
		naturalFrequencies[i] = naturalFrequencies[i-1] * 2**(naturalScale[i+5]/72)
	}

	//set base note as Ni
	setBaseNote()

	//initialize reverb, filter and gain for oscillators
	reverb(48000,1,1,0) //audioCtx.sampleRate returns sample rate but it is not supported in safari
	filter()
	gain(1,0.5,0.3)

	//audio connections
	//node is just a node where oscillator will be connected
	node.connect(dry).connect(output)
  	node.connect(wet).connect(convolver).connect(biquadFilter).connect(output)
  	output.connect(audioCtx.destination)
}

function createWave(data) {
	var real = new Float32Array(data["real"])
	var imag = new Float32Array(data["imag"])
    //var real = data["real"]
    //var imag = data["imag"]
    hornTable = audioCtx.createPeriodicWave(real, imag);
}

function filter () {
    biquadFilter.type = "lowpass";
	biquadFilter.frequency.setValueAtTime(5000, audioCtx.currentTime);
	biquadFilter.Q.setValueAtTime(10, audioCtx.currentTime);
}

function reverb (sampleRate, seconds, decay, reverse) {
    var rate = sampleRate
    var length = rate * seconds

    var impulse = audioCtx.createBuffer(2, length, rate)
    var impulseL = impulse.getChannelData(0)
    var impulseR = impulse.getChannelData(1)
    var n, i

    for (i = 0; i < length; i++) {
      n = reverse ? length - i : i;
      impulseL[i] = (Math.random() * 2 - 1) * Math.pow(1 - n / length, decay);
      impulseR[i] = (Math.random() * 2 - 1) * Math.pow(1 - n / length, decay);
    }
    convolver.buffer = impulse;
}

function gain(dryGain,wetGain,totalGain) {
  dry.gain.value = dryGain
  wet.gain.value = wetGain
  output.gain.value = totalGain
}


function setFthora(param) {
	let currentFthora
	// reset previous fthora
	fthorasCollection[fthoraIndex].style.filter = "invert(0%)"
	
	
	//handle param
	if (typeof param === 'undefined') { //i.e. no parameter
		currentFthora = fthorasCollection[0]
	} else if (typeof param === 'object') { //i.e. event parameter
		currentFthora = param.target
	} else if (typeof(param) === 'number') {  //i.e. number from other function
		currentFthora = fthorasCollection[param]
	}

	const imageSrc = decodeURI(currentFthora.src)  //decodeURI reads space as " " not as %20
	const imageName = imageSrc.slice(imageSrc.lastIndexOf("/")+1,imageSrc.lastIndexOf("."))
	const scaleName = imageName.slice(0,imageName.lastIndexOf("_"))
	const fthoraName = imageName.slice(imageName.lastIndexOf("_")+1,imageName.length).replace("1","'")
	//fthoraName = fthoraName.replace("1","'")
	document.querySelector("#scaleSpan").innerText = scaleName
	document.querySelector("#fthoraSpan").innerText = fthoraName
	fthoraIndex = getIndexInsideParent(currentFthora)
	currentFthora.style.filter = "invert(100%)"
	
	setTransposedNoteNames()
	setMartyria()
	resetScale()

}

function resetScale () {
	//set fine tune options for base note
	setFineTuneOption()

	//set input intervals elements
	setInputIntervals(getScale(),calculateOffset())

	//initilize actual frequencies
	updateActualFrequencies()
}

function getScale () {
	var currentScale
	var scaleName = document.querySelector("#scaleSpan").innerText
	switch (scaleName.toUpperCase()) {
		case "DIATONIC":
			currentScale = diatonicScale
			break
		case "ENHARMONIC":
			currentScale = enharmonicScale
			if (document.querySelector("#fthoraSpan").innerText == "Zo") {currentScale = enharmonicScaleZo}
			break
		case "KLITON":
			currentScale = klitonScale
			break
		case "ZYGOS":
			currentScale = zygosScale
			break
		case "SPATHI":
			currentScale = spathiScale
			break
		case "HARD CHROMATIC":
			currentScale = hardChromaticScale
			break
		case "SOFT CHROMATIC":
			currentScale = softChromaticScale
			break
		case "SPECIAL":
			currentScale = specialScale
			break
		default:
			currentScale = naturalScale
	}
	return currentScale
}

function calculateOffset () {
	// this function calculates offset
	// offset[0] is the difference between fthora base note and selected base note
	// offset[1] show which octave the basenote is 
	
	const noteNames = ["Zo", "Ni", "Pa", "Vou", "Gha", "Dhi", "Ke"]
	var offset = [0,0]
	
	var fthoraName = document.querySelector("#fthoraSpan").innerText
	fthoraName = fthoraName.replace("2","")
	
	if (fthoraName.indexOf("'") != -1) {
		offset[1] = -1
		fthoraName = fthoraName.replace("'","")
	}
	
	var baseNoteName = document.querySelector("#baseNoteSpan").innerText
	if (baseNoteName.indexOf("'") != -1) {
		offset[1] += 1
		baseNoteName = baseNoteName.replace("'","")
	}

	if (baseNoteName.indexOf("-1") != -1) {
		offset[1] -= 1
		baseNoteName = baseNoteName.replace("-1","")
	}
	//for scales covering all intervals (i.e do not include 0's in them) no need to offset octave
	var currentScale = getScale()
	//if (currentScale.indexOf(0) == -1) {offset[1] = 0}  

	offset[0] = noteNames.indexOf(fthoraName)-noteNames.indexOf(baseNoteName)
	return offset
}

function setBaseNote(param) {
	//set base note sets also the most suitable finetuning of the base note based on fthora used
	let noteKey

	noteKeyCollection[baseNoteIndex].classList.remove('baseNote')
	
	//handle param
	if (typeof param === 'undefined') { //i.e. no parameter
		noteKey = noteKeyCollection[4]
	} else if (typeof param === 'object') { //i.e. event parameter
		noteKey = param.target
	} else if (typeof(param) === 'number') {  //i.e. number from other function
		noteKey = noteKeyCollection[param]
	}

	baseNoteIndex = getIndexInsideParent(noteKey)
	noteKey.classList.add('baseNote')
	document.querySelector("#baseNoteSpan").innerText = noteKey.id

	setTransposedNoteNames()
	setMartyria()
	resetScale()
}

function setMartyria () {
	var currentScale
	var i, j
	var offset = calculateOffset()
	var scaleName = document.querySelector("#scaleSpan").innerText
	var fthoraName = document.querySelector("#fthoraSpan").innerText
	switch (scaleName.toUpperCase()) {
		case "DIATONIC":
			currentScale = martyriaDiatonic
			break
		case "ENHARMONIC":
			if (fthoraName.toUpperCase() == 'GHA') {currentScale = martyiraEnharmonicGha}
			if (fthoraName.toUpperCase() == 'GHA2') {currentScale = martyiraEnharmonicGha2}
			if (fthoraName.toUpperCase() == 'ZO') {currentScale = martyiraEnharmonicZo}
			break
		case "KLITON":
			currentScale = martyriaKliton
			break
		case "ZYGOS":
			currentScale = martyriaZygos
			break
		case "SPATHI":
			currentScale = martyriaSpathi
			break
		case "HARD CHROMATIC":
			currentScale = martyriaHardChromatic
			break
		case "SOFT CHROMATIC":
			currentScale = martyriaSoftChromatic
			break
		case "SPECIAL":
			currentScale = martyriaSpecial
			break
		default:
			currentScale = martyriaNatural
	}
	
	for (i=0; i<noteKeyCollection.length; i++) {
		j = i + 6 + offset[0] - 7 * offset[1]
		if ((j>0) && (j<currentScale.length)) {
			martyriaLetterCode = (currentScale[j] != 0)? currentScale[j]: ""
		} else {
			martyriaLetterCode = ""
		}
		
		if (martyriaLetterCode == 'R' || martyriaLetterCode == 'I') {
			noteKeyCollection[i].querySelector('.variable').classList.add('specialMartyria')
		} else {
			noteKeyCollection[i].querySelector('.variable').classList.remove('specialMartyria')
		}
		noteKeyCollection[i].querySelector('.variable').innerText = martyriaLetterCode
	}
}

function setTransposedNoteNames () {
	var i
	var offset = calculateOffset()

	for (i=0;i<noteKeyCollection.length;i++) {
		noteKeyCollection[i].querySelector('.transposedNoteName').innerText = extendedNoteNames[i + 6 + offset[0]]
	}
}

function setFineTuneOption () {
	//set Fine Tune Option
	///////////////////////
	var genre = document.getElementById("scaleSpan").innerText
	var fthoraName = document.querySelector("#fthoraSpan").innerText
	fthoraName = fthoraName.replace("2","")
	
	var baseNoteName = document.querySelector("#baseNoteSpan").innerText
	if (baseNoteName.indexOf("'") != -1) baseNoteName = baseNoteName.replace("'","")
	if (baseNoteName.indexOf("-1") != -1) baseNoteName = baseNoteName.replace("-1","")

	let fineTuneOption = 'natural'
	switch (baseNoteName) {
		case 'Ni': case 'Pa': case 'Gha': case 'Dhi': case 'Ke':
			if ((fthoraName == 'Vou' || fthoraName == 'Zo') && genre == 'Diatonic') fineTuneOption = 'diatonic'
			break;
		case 'Vou': case 'Zo':
			if ((fthoraName == 'Vou' || fthoraName == 'Zo') && genre == 'Diatonic') fineTuneOption = 'diatonic'
			if (genre == 'Enharmonic' || genre == 'Special') fineTuneOption ='flat'
			break;
	}

	var i
	for (i=0; i<radioFineTuneBase.length; i++) {
		if (radioFineTuneBase[i].value == fineTuneOption) radioFineTuneBase[i].checked = true
	}
}

function setInputIntervals(scale, offset) {
	//set input intervals elements (except first and last that are fillers)
	//note that scale is extended 6 intervals up/down
	//so gha-1/dhi-1 interval in scale is actually the index 6
	//offset is used when fthora is not used on it's basic note
	//offset[0] note difference
	//offset[1] octave difference
	//REMEMBER that first and last items of inputIntervalCollection are NOT USABLE
	var j
	var i
	
		for (i=1; i<inputIntervalsCollection.length-1; i++) {
			j = i + 5 + offset[0] - 7 * offset[1]
			if ((j>0) && (j<scale.length)) {
				inputIntervalsCollection[i].value = (scale[j] != 0)? scale[j]: ""
			} else {
				inputIntervalsCollection[i].value = ""
			}
		}
}

function updateActualFrequencies () {
	//this functions generates the frequencies of each note in the scale according to
	//1- intervals
	//2- base note selected
	//3- base note fune tuning option selected
	//4- general transpose
	var i
	var fineTuneOption, fineTuneValue, transposeValue

	//General Transposition is based on 12-TET scale
	transposeValue = document.getElementById('transposeInput').value  
	
	for (i=0; i<radioFineTuneBase.length; i++) {
		if (radioFineTuneBase[i].checked) fineTuneOption = radioFineTuneBase[i].value
	}
	
	//fineTuneValue is based on 72-TET scale
	switch (fineTuneOption) {
		case "flat":
			fineTuneValue = -6
			break;
		case "diatonic":
			fineTuneValue = -2
			break;
		case "natural":
			fineTuneValue = 0
			break;
	}
	actualFrequencies[baseNoteIndex] = naturalFrequencies[baseNoteIndex] * 2**(transposeValue/12) * 2**(fineTuneValue/72)
	
	// update notes that are before baseNote
	for (i = baseNoteIndex-1; i >= 0; i--) {
		actualFrequencies[i] = actualFrequencies[i+1] * 2**(-inputIntervalsCollection[i+1].value/72)
	}
	// update notes that are after baseNote
	for (i = baseNoteIndex+1; i < actualFrequencies.length; i++) {
		actualFrequencies[i] = actualFrequencies[i-1] * 2**(inputIntervalsCollection[i].value/72)
	}
	setStateNoteKeys()
	
}

function setStateNoteKeys () {
	//this functions disables note keys that have empty intervals
	//one way to approach is to disable each note key that has same frequency of adjacent note key
	//starting from base note and outward left and right
	var i
	for (i=baseNoteIndex+1; i<actualFrequencies.length; i++) {
		if (actualFrequencies[i] == actualFrequencies[i-1]) {
			noteKeyCollection[i].classList.add('noteKeyDisabled');
			noteKeyCollection[i].querySelector('.martyria').classList.add('hidden')
			noteKeyCollection[i].querySelector('.transposedNoteName').classList.add('hidden')
		} else {
			noteKeyCollection[i].classList.remove('noteKeyDisabled');
			noteKeyCollection[i].querySelector('.martyria').classList.remove('hidden')
			noteKeyCollection[i].querySelector('.transposedNoteName').classList.remove('hidden')
		}
	}

	for (i=baseNoteIndex-1; i>=0; i--) {
		if (actualFrequencies[i] == actualFrequencies[i+1]) {
			noteKeyCollection[i].classList.add('noteKeyDisabled');
			noteKeyCollection[i].querySelector('.martyria').classList.add('hidden')
			noteKeyCollection[i].querySelector('.transposedNoteName').classList.add('hidden')
		} else {
			noteKeyCollection[i].classList.remove('noteKeyDisabled');
			noteKeyCollection[i].querySelector('.martyria').classList.remove('hidden')
			noteKeyCollection[i].querySelector('.transposedNoteName').classList.remove('hidden')
		}
	}
	noteKeyCollection[baseNoteIndex].classList.remove('noteKeyDisabled');
	noteKeyCollection[baseNoteIndex].querySelector('.martyria').classList.remove('hidden')
	noteKeyCollection[baseNoteIndex].querySelector('.transposedNoteName').classList.remove('hidden')
}

function inputIntervalChanged(event) {
	// check if input is valid
	// limits are put using html attributes in input element
	// validity object has different properties to check if valid or not 
	if (!(event === undefined)) {
		var inputInterval = event.target
		var validityState = inputInterval.validity
	
		if (!validityState.valid) {
			inputInterval.value = 12
			return
		}
	}
	updateActualFrequencies()		
}

function plusMinusPressed (event) {
	const plusMinusBtn = event.target
	const btnIndex = getIndexInsideParent(plusMinusBtn)
	const itIsPlus = (plusMinusBtn.innerText == "+")
	const noteKeyIndex = itIsPlus? (btnIndex-1)/2 : btnIndex/2
	
	changeInterval(noteKeyIndex,itIsPlus)
}

function changeInterval (index, add) {
	// add is a boolean if true then add 1 if false then remove 1
	// index is the note index
	// this function changes 2 intervals at a time increasing one decreasing the other
	// if index is at either limits of the collection then change one interval accordingly
	const length = noteKeyCollection.length
	if (add) {
		if (index < length - 1) {
			inputIntervalsCollection[index + 1].stepDown()
		}
		if (index > 0) { 
			inputIntervalsCollection[index].stepUp()
		}
	} else {
		if (index < length - 1) {
			inputIntervalsCollection[index + 1].stepUp()
		}
		if (index > 0) { 
			inputIntervalsCollection[index].stepDown()
		}
	}
	inputIntervalChanged()
}

function getIndexInsideParent (child) {
	// this function is used to return the index of child element inside parent
	// mainly used to know index of an event.target inside a html parent element
	const parent = child.parentElement
	var i
	for (i = 0; i < parent.children.length; i++) {
		if (parent.children[i] === child) {
			return i
		}
	}
}

function playNote (noteIndex, noteEvent) {
	// 2 things are handled at eventlistener declaration
	// ctrl key --> sets the base note
	// and checkin if the note is disabled

	// at this function
	// alt key --> raise the note
	// shift key --> lower note note
	// basically: raising or lowering a note functions in a way to make the interval between note and adjacent note = 6 comas
	// and if the difference is less than 6 than do nothing, if difference is larger than 17 then new interval will be set to 12comas
	// in case of raising the note: 
	// 		adjacent note is the note directly to the right
	//		if the note is to the extreme right then adjacent note will be to the left and interval will be set to 12 comas
	// in case of lowering the note:
	// 		adjacent note is the note directly to the left
	//		if the note is to the extreme left then adjacent note will be to the right and interval will be set to 12 comas
	
	//first we need to identify if noteEvent is coming from mouse or keyboard
	//this is because mouse returns a target object but keyboard does not
	
	numberOfKeysAtTheSameTime += 1

	//here we are sure note is not disabled
	let note = actualFrequencies[noteIndex]

	//mouse and keyboard events have .shiftkey, .ctrlKey and .altKey
	//for keyboard events,
	//if shift,ctrl or alt are pressed alone then event.key will be respectively Shift,Control,Alt
	//when pressed with another key then we have a combination if .shiftKey, .ctrlKey and .altKey will work

	var interval
	if (noteEvent.shiftKey) {
		document.querySelector('#shiftKey').classList.add('used')
		if (noteIndex > 0) {
			interval = getSuitableInterval (actualFrequencies[noteIndex-1],actualFrequencies[noteIndex])
			if (interval != -1) {note = actualFrequencies[noteIndex-1] * 2 ** (interval/72)} //set note equal to adjacent raised 6 comas
		} else {
			interval = getSuitableInterval (actualFrequencies[noteIndex+1],actualFrequencies[noteIndex])
			if (interval != -1) {note = actualFrequencies[noteIndex+1] * 2 ** (interval/72)} //set note equal to adjacent lowered 12 comas
		}
	}
	if (noteEvent.altKey) {
		document.querySelector('#altKey').classList.add('used')
		if (noteIndex < actualFrequencies.length-1) {
			interval = getSuitableInterval (actualFrequencies[noteIndex],actualFrequencies[noteIndex+1])
			if (interval != -1) {note = actualFrequencies[noteIndex+1] * 2 ** (-interval/72)} //set note equal to adjacent lowered 6 comas
		} else {
			interval = getSuitableInterval (actualFrequencies[noteIndex],actualFrequencies[noteIndex-1])
			if (interval != -1) {note = actualFrequencies[noteIndex-1] * 2 ** (-interval/72)} //set note equal to adjacent raised 12 comas
		}
	}
	if (oscillatorsCollection[noteIndex] === undefined) playSound(note, noteIndex)	
}

function getSuitableInterval (freq1, freq2) {
	//positive if freq2 > freq1
	//negative coma difference is intended to be used for the farmost notes to the left and right that have no adjacent notes
	var interval
	var comaDifference = Math.log2(freq2/freq1)*72
	
	if (comaDifference >= 0) {
		if (comaDifference < 6) {return -1}
		if (comaDifference < 17) {
			interval = 6
		} else {
			interval = 12
		}
	} else {
		if (comaDifference < -20) {return -1}
		if (comaDifference < -12) {
			interval = -20
		} else {
			interval = -12
		}
	}
	return interval
}

function playSound (frequency, index) {
//Primary music function

	if (index === undefined) {
		index = 4;
	}
	if (frequency === undefined) {
		frequency = 440;
	}

	oscillatorsCollection[index] = audioCtx.createOscillator();
	oscillatorsCollection[index].setPeriodicWave(hornTable)
	oscillatorsCollection[index].frequency.value = frequency;
	
	gainCollection[index] = audioCtx.createGain();
	
	
	//IMPORTANT:
	//---------
	//exponential and linear ramp start from the time of previous previous scheduled parameter value to the given value
	//so it necessary to first set the gain with an automation method before using the ramping function
	//----------
	gainCollection[index].gain.value = 0
	gainCollection[index].gain.linearRampToValueAtTime(0.5, audioCtx.currentTime + 0.002)
	
	oscillatorsCollection[index].connect(gainCollection[index]).connect(node)
	
	oscillatorsCollection[index].start();
}

playTone = (frequency, index, type) => {
	//Primary music function

	if (type === undefined) {
		type = "sawtooth";
	}
	if (index === undefined) {
		index = 4;
	}
	if (frequency === undefined) {
		frequency = 440;
	}

	oscillatorsCollection[index] = audioCtx.createOscillator();
	gainCollection[index] = audioCtx.createGain();

	oscillatorsCollection[index].type = type;
	oscillatorsCollection[index].frequency.value = frequency;
	
	//IMPORTANT:
		//---------
		//exponential and linear ramp start from the time of previous previous scheduled parameter value to the given value
		//so it necessary to first set the gain with an automation method before using the ramping function
		//----------
	gainCollection[index].gain.value = 0
	gainCollection[index].gain.linearRampToValueAtTime(0.3, audioCtx.currentTime + 0.002)
	filterOn = true
	if (filterOn) {
		oscillatorsCollection[index].connect(gainCollection[index]).connect(biquadFilter).connect(audioCtx.destination)
	} else {
		oscillatorsCollection[index].connect(gainCollection[index]).connect(audioCtx.destination)
	}

	//start oscillator then reduce gain to 0 after duration is passed
	oscillatorsCollection[index].start();
}

function createArray(length) {
	//This function creates an n-dimensional array by passing n arguments to the function.
	//each argument passed represents the corresponding length of the array dimension
	//example:
	// var myArray = createArray(3,3,5) 
	// this creates a 3 dimensional array
	// first dimension length is 3, second dimension length is 3, third dimension length is 5

	var arr = new Array(length || 0),
        i = length;

    if (arguments.length > 1) {
        var args = Array.prototype.slice.call(arguments, 1);
        while(i--) arr[length-1 - i] = createArray.apply(this, args);
    }

    return arr;
}