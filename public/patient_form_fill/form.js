var currentTab = 0;
showTab(currentTab);

function showTab(_current_tab) {
    currentTab = _current_tab
    var x = document.getElementsByClassName("patient-form-fill-tab");
    x[_current_tab].style.display = "block";

    if (_current_tab == 0) {
        document.getElementById("prevBtn").style.display = "none";
    } else {
        document.getElementById("prevBtn").style.display = "inline";
    }
    
    if (_current_tab == (x.length - 1)) {
        document.getElementById("nextBtn").style.display = "none";
    } else {
        document.getElementById("nextBtn").style.display = "inline";
    }
    fixStepIndicator(_current_tab)
}

function nextPrev(change) {
  if (!validateForm()) return false;
  currentTab = currentTab + change;
  showTab(currentTab);
}

function validateForm() {
    return true;
//   var x, y, i, valid = true;
//   x = document.getElementsByClassName("patient-form-fill-tab");
//   y = x[currentTab].getElementsByTagName("input");
//   for (i = 0; i < y.length; i++) {
//     // If a field is empty...
//     if (y[i].value == "") {
//       // add an "invalid" class to the field:
//       y[i].className += " invalid";
//       // and set the current valid status to false:
//       valid = false;
//     }
//   }
//   // If the valid status is true, mark the step as finished and valid:
//   if (valid) {
//     document.getElementsByClassName("step")[currentTab].className += " finish";
//   }
//   return valid; // return the valid status
}

function fixStepIndicator(_current_tab) {
  var i, x = document.getElementsByClassName("step");
  var tab = document.getElementsByClassName("patient-form-fill-tab");
  for (i = 0; i < x.length; i++) {
    tab[i].style.display = "none";
    x[i].className = "step";
  }
  x[_current_tab].className = "step active";
  tab[_current_tab].style.display = "block";
}

function submit(){
    document.getElementById("patientForm").submit();
}