// Copyright © 2016 M. Helmy Hemeda.

function get_random_int(max, except) {
	if(typeof except === "undefined") {
		except = []
	}
	
	var outcome;
	do {
		outcome =  Math.floor(Math.random() * (max + 1));
	} while (except.indexOf(outcome) > -1);

	return outcome;
};

function get_random_triplet(except) {
	var digits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
	var triplet = [];

	// Every element from except will be removed from digits.
	for(var i = 0; i < except.length && digits.length > 0; i++) {
		var removal_index = digits.indexOf(except[i]);
		
		if(removal_index > -1) {
			digits.splice(removal_index, 1);
		}
	}
	
	// Select a random element from digits, push it to triplet, remove it from
	// digits, then repeat 3 times.
	for(var i = 0; i < 3 && digits.length > 0; i++) {
		var selection_index = get_random_int(digits.length - 1);
		triplet.push(digits[selection_index]);
		digits.splice(selection_index, 1);
	}
	
	return triplet;
};

constraints = [
	{
		"description": "One number is correct and is in the right place.",
		"get_random_hint": function(answer) {
			var hints = get_random_triplet(answer);
			var selection_index = get_random_int(answer.length - 1);
			hints[selection_index] = answer[selection_index];
			return hints;
		},
		"check": function(input, hints) {
			if(input.length != hints.length) {
				return false;
			}
			
			for(var i = 0; i < input.length; i++) {
				if(input[i] == hints[i]) {
					return true;
				}
			}

			return false;
		}
	},
	{
		"description": "One number is correct but is at the wrong place.",
		"get_random_hint": function(answer) {
			var selection_index = get_random_int(answer.length - 1);
			var selection = answer[selection_index];
			var hints = get_random_triplet([selection]);

			var insertion_index;

			do {
				insertion_index = get_random_int(answer.length - 1);
			} while (insertion_index == selection_index);

			hints[insertion_index] = answer[selection_index];

			return hints;
		},
		"check": function(input, answer) {
			if(input.length != answer.length) {
				return false;
			}
			
			for(var i = 0; i < input.length; i++) {
				if(answer.indexOf(input[i]) > - 1 && answer[i] != input[i]) {
					return true;
				}
			}

			return false;
		}
	},
	{
		"description": "Two numbers are correct but are at wrong places",
		"get_random_hint": function(answer) {
			var temp = answer.slice();
			var replacement_index = get_random_int(answer.length - 1);
			temp[replacement_index] = get_random_int(9, answer);

			var selection_index1 = get_random_int(answer.length - 1, [replacement_index]);
			var selection_index2 = get_random_int(answer.length - 1, [replacement_index, selection_index1]);

			var hints = Array(3)
			var permutation_type = get_random_int(2);
			
			if(permutation_type == 0) {
				hints[selection_index1] = temp[selection_index2];
				hints[selection_index2] = temp[selection_index1];
				hints[replacement_index] = temp[replacement_index];
			}
			else if(permutation_type == 1) {
				hints[selection_index1] = temp[replacement_index];
				hints[selection_index2] = temp[selection_index1];
				hints[replacement_index] = temp[selection_index2];
			}
			else if(permutation_type == 2) {
				hints[selection_index1] = temp[selection_index2];
				hints[selection_index2] = temp[replacement_index];
				hints[replacement_index] = temp[selection_index1];
			}
			else {
				alert("Internal error: unknown permutation");
			}

			return hints;
		},
		"check": function(input, answer) {
			if(input.length != answer.length) {
				return false;
			}
			
			var found_correct_number_wrong_place = false;
			for(var i = 0; i < input.length; i++) {
				if(answer.indexOf(input[i]) > -1 && answer[i] != input[i]) {
					if(found_correct_number_wrong_place) {
						return true;
					}
					else {
						found_correct_number_wrong_place = true;
					}
				}
			}

			return false;
		}
	},
	{
		"description": "Nothing is correct.",
		"get_random_hint": function(answer) {
			var hint =  get_random_triplet(answer);
			return hint;
		},
		"check": function(input, hints) {
			if(input.length != hints.length) {
				return false;
			}

			for(var i = 0; i < input.length; i++) {
				if(hints.indexOf(input[i]) > -1) {
					return false;
				} 

				return true;
			}
		}
	},
];
constraints.push(constraints[1]);

function reload_hints () {
	window.hints_list = [];
	window.valid_answer = get_random_triplet([]);

	document.getElementById("digit0").value = "";
	document.getElementById("digit1").value = "";
	document.getElementById("digit2").value = "";

	var table = document.getElementById("hints");
	table.innerHTML = "";


	for(var c=0; c < constraints.length; c++) {
		var row = table.insertRow(-1);
		var hints = constraints[c]["get_random_hint"](window.valid_answer);

		window.hints_list.push(hints);

		for(var h = 0; h < hints.length; h++) {
			var cell = row.insertCell(-1);
			cell.innerHTML = hints[h];
		}

		var cell = row.insertCell(-1);
		cell.innerHTML = constraints[c]["description"];
	}

	check_answer();
};

function giveup() {
	document.getElementById("digit0").value = window.valid_answer[0];
	document.getElementById("digit1").value = window.valid_answer[1];
	document.getElementById("digit2").value = window.valid_answer[2];
	check_answer();
};

function check_answer() {
	var ans = [
		document.getElementById("digit0").value,
		document.getElementById("digit1").value,
		document.getElementById("digit2").value
	];
		
	var digit_pattern = new RegExp("^[0-9]$");

	for(var i = 0; i < ans.length; i++) {
		if(!digit_pattern.test(ans[i])) {
			document.getElementById("status").innerHTML = "Enter a decimal digit in every cell.";
			return;
		}
		ans[i] = Number(ans[i]);
	}

	for(var c = 0; c < constraints.length; c++) {

		if(!constraints[c]["check"](ans, window.hints_list[c])) {
			document.getElementById("status").innerHTML = "Wrong answer!";
			return;
		}
	}

	document.getElementById("status").innerHTML = "YOU GAVE UP!!!";
};

