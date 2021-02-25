let markov;
let author_1 = 'kafka';
let author_2 = 'wittgenstein';
let n_factor = 4;
let sentences = 10;

console.log('author_1', author_1);
console.log('author_2', author_2);
console.log('n_factor', n_factor);
console.log('sentences', sentences);

$(function () {

  if (getURLParameter('author_1')) {
    author_1 = getURLParameter('author_1');

    jQuery("#author_1").val(author_1);
  }
  if (getURLParameter('author_2')) {
    author_2 = getURLParameter('author_2');

    jQuery("#author_2").val(author_2);
  }
  if (getURLParameter('n_factor')) {
    n_factor = parseInt(getURLParameter('n_factor'));
  }
  if (getURLParameter('sentences')) {
    sentences = parseInt(getURLParameter('sentences'));
  }

  markov = RiTa.markov(n_factor, { disableInputChecks: true });

  $.when(
    $.get('./assets/data/'+ author_1 +'.txt'),
    $.get('./assets/data/'+ author_2 +'.txt'),

  ).done(function(data1, data2) {
    markov.addText(data1[0]);
    markov.addText(data2[0]);

    jQuery('#textarea-output').text("click to (re)generate");
    jQuery(document).on('click', '.generate', function(e) {
      e.preventDefault();
      generate();
    });

    jQuery(document).on('change', '#author_1', function(e) {
      e.preventDefault();
      window.location.href = updateURLParameter(window.location.href, 'author_1', jQuery(this).val());
    });
    jQuery(document).on('change', '#author_2', function(e) {
      e.preventDefault();
      window.location.href = updateURLParameter(window.location.href, 'author_2', jQuery(this).val());
    });
    jQuery(document).on('change', '#n_factor', function(e) {
      e.preventDefault();
      window.location.href = updateURLParameter(window.location.href, 'n_factor', jQuery(this).val());
    });
    jQuery(document).on('change', '#sentences', function(e) {
      e.preventDefault();
      window.location.href = updateURLParameter(window.location.href, 'sentences', jQuery(this).val());
    });

  }).fail(function() {
    console.error('fail to fetch');
  });


});

function generate() {
  let lines = markov.generate(sentences);

  jQuery('#textarea-output').text(lines.join('\n'));
  jQuery('#textarea-output').attr('rows', sentences*2)
}

// generator.html?author_1=verlaine&author_2=aretino&n_factor=4&sentences=10
function getURLParameter(sParam) {
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++) {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam) {
            return sParameterName[1];
        }
    }
}

function updateURLParameter(url, param, paramVal){
    let newAdditionalURL = "";
    let tempArray = url.split("?");
    let baseURL = tempArray[0];
    let additionalURL = tempArray[1];
    let temp = "";
    if (additionalURL) {
        tempArray = additionalURL.split("&");
        for (let i=0; i<tempArray.length; i++){
            if(tempArray[i].split('=')[0] != param){
                newAdditionalURL += temp + tempArray[i];
                temp = "&";
            }
        }
    }

    let rows_txt = temp + "" + param + "=" + paramVal;
    return baseURL + "?" + newAdditionalURL + rows_txt;
}
