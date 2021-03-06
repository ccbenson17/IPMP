define([
  "esri/InfoTemplate",
  "esri/map",
  "esri/layers/FeatureLayer",
  "esri/symbols/SimpleFillSymbol",
  "esri/symbols/SimpleLineSymbol",
  "esri/tasks/query",
  "esri/tasks/QueryTask",
  "esri/tasks/StatisticDefinition",
  "esri/toolbars/draw",
  "dojo/dom",
  "dojo/on",
  "dojo/parser",
  "dojo/_base/array",
  "esri/dijit/Search",
  "esri/Color",
  "esri/graphic",
  "dijit/form/Button",
  "dojo/domReady!"
], function(InfoTemplate, Map, FeatureLayer, SimpleFillSymbol, SimpleLineSymbol, Query, QueryTask, StatisticDefinition, Draw, dom, on, parser, arrayUtil, Search, Color, Graphic) {
  parser.parse();
  var selectionToolbar, featureLayer, options, PaveType; //options = treatment options

  map = new Map("map", {
    basemap: "streets-night-vector",
    center: [-93.61994, 42.03471],
    zoom: 13
  });

  // implementing basic search
  var search = new Search(
    {
      map: map
    },
    "search"
  );
  search.startup();

  map.on("load", initSelectToolbar);

  var fieldsSelectionSymbol = new SimpleFillSymbol(
    SimpleFillSymbol.STYLE_SOLID,
    new SimpleLineSymbol(SimpleLineSymbol.STYLE_DASHDOT, new Color([255, 0, 0]), 2),
    new Color([255, 255, 0, 0.5])
  );

  var content =
    "<b>Roughness</b>: ${IRI}" +
    "<br><b>PCI</b>: ${PCI}" +
    "<br><b>Date Collected</b>: ${MIN_DATE}" +
    "<br><b>Pavement Type</b>: ${PAVE_TYPE}" +
    "<br><b>Pavement Length</b>: ${PM_LGTH} feet";
  var infoTemplate = new InfoTemplate("${IPMP_RTE}");

  featureLayer = new FeatureLayer("https://ipmp.ctre.iastate.edu/arcgis/rest/services/featservice15/FeatureServer/2", {
    mode: FeatureLayer.MODE_ON_DEMAND,
    infoTemplate: infoTemplate,
    outFields: ["*"]
  });

  featureLayer.setDefinitionExpression("PCI >= 0");
  featureLayer.setSelectionSymbol(fieldsSelectionSymbol);
  featureLayer.on("selection-complete", getStats);
  //clear the results when clear selection button is clicked
  featureLayer.on("selection-clear", function() {});
  map.addLayer(featureLayer);

  on(dom.byId("selectFieldsButton"), "click", function() {
    selectionToolbar.activate(Draw.EXTENT);
  });

  on(dom.byId("clearSelectionButton"), "click", function() {
    featureLayer.clearSelection();
  });

  var sumLongDef = new StatisticDefinition();
  sumLongDef.statisticType = "sum";
  sumLongDef.onStatisticField = "((LONG_L + LONG_M + LONG_H + LONG_WP_L + LONG_WP_M + LONG_WP_H) / 5280) * CALC_LGTH";
  sumLongDef.outStatisticFieldName = "sumLONG";

  var sumTRANSDef = new StatisticDefinition();
  sumTRANSDef.statisticType = "sum";
  sumTRANSDef.onStatisticField = "(((TRANS_L + TRANS_M + TRANS_H)* 9.02) / 5280)* CALC_LGTH";
  sumTRANSDef.outStatisticFieldName = "sumTRANS";

  var sumALLIGDef = new StatisticDefinition();
  sumALLIGDef.statisticType = "sum";
  sumALLIGDef.onStatisticField = "(((ALLIG_M + ALLIG_H) * 24) / (CALC_LGTH * 24)) *100";
  sumALLIGDef.outStatisticFieldName = "sumALLIG";

  //assumes joint spacing of 20 ft
  var sumDCRACKDef = new StatisticDefinition();
  sumDCRACKDef.statisticType = "sum";
  sumDCRACKDef.onStatisticField = "((DCRACK_M + DCRACK_H) / 264) * (CALC_LGTH / 20)";
  sumDCRACKDef.outStatisticFieldName = "sumDCRACK";

  var sumJSPALLDef = new StatisticDefinition();
  sumJSPALLDef.statisticType = "sum";
  sumJSPALLDef.onStatisticField = "((JSPALL_M + JSPALL_H) / 264) * (CALC_LGTH / 20)";
  sumJSPALLDef.outStatisticFieldName = "sumJSPALL";

  var avgIRIDef = new StatisticDefinition();
  avgIRIDef.statisticType = "avg";
  avgIRIDef.onStatisticField = "IRI";
  avgIRIDef.outStatisticFieldName = "avgIRI";

  var avgRUTDef = new StatisticDefinition();
  avgRUTDef.statisticType = "avg";
  avgRUTDef.onStatisticField = "(AVG_LRUT + AVG_RRUT)/2";
  avgRUTDef.outStatisticFieldName = "avgRUT";

  var maxDateDef = new StatisticDefinition();
  maxDateDef.statisticType = "max";
  maxDateDef.onStatisticField = "MAX_DATE";
  maxDateDef.outStatisticFieldName = "maxDATE";

  var sumLengthStatDef = new StatisticDefinition();
  sumLengthStatDef.statisticType = "sum";
  sumLengthStatDef.onStatisticField = "CALC_LGTH / 5280";
  sumLengthStatDef.outStatisticFieldName = "sumLENGTH";

  var selectQuery = new Query();
  // selectQuery.distance = 16;  // Return all segments within 16m of the point
  //selectQuery.units = "meters";
  selectQuery.outFields = ["*"];
  selectQuery.outStatistics = [sumLongDef, sumTRANSDef, sumALLIGDef, sumDCRACKDef, sumJSPALLDef, avgIRIDef, avgRUTDef, maxDateDef, sumLengthStatDef];

  function initSelectToolbar(event) {
    selectionToolbar = new Draw(event.map);

    on(selectionToolbar, "DrawEnd", function(geometry) {
      selectionToolbar.deactivate();
      selectQuery.geometry = geometry;
      featureLayer.selectFeatures(selectQuery, FeatureLayer.SELECTION_NEW);
    });
  }

  // Executes on each query
  function getStats(results) {
    // The return object of the query containing the statistics requested
    var stats = results.features[0].attributes;
    PaveType = results.features[0].attributes.PAVE_TYPE;

    // get date to use to query which year to use
    var coldate = new Date();
    coldate.setTime(stats.maxDATE);
    var iri = stats.avgIRI;
    var rut = stats.avgRUT;
    var long = stats.sumLONG;
    var trans = stats.sumTRANS;
    var allig = stats.sumALLIG;
    var dcrack = stats.sumDCRACK;
    var jspall = stats.sumJSPALL;
    var lgth = stats.sumLENGTH;
    var pava = PaveType;

    // Print the statistic results to the DOM
    dom.byId("IriResult").innerHTML = Math.round(iri) + " in/mi";
    dom.byId("RutResult").innerHTML = rut.toFixed(3) + " in";
    dom.byId("LongResult").innerHTML = long.toFixed(2) + " ft/mi";
    dom.byId("TransResult").innerHTML = trans.toFixed(2) + " ft/mi";
    dom.byId("AlligResult").innerHTML = allig.toFixed(2) + " %";
    dom.byId("DcrackResult").innerHTML = dcrack.toFixed(2) + " count/mi";
    dom.byId("JspallResult").innerHTML = jspall.toFixed(2) + " count/mi";
    dom.byId("sumLengthResult").innerHTML = lgth.toFixed(2) + " mi";
    dom.byId("colYear").innerHTML = coldate.getFullYear();

    var select_id = document.getElementById("pave_type");

    if (select_id.options[select_id.selectedIndex].value == "PCC") {
      PCCtreatments(long, trans, dcrack, jspall, lgth);
    } else {
      ACCtreatments(rut, long, trans, allig, lgth);
    }
  }

  function ACCtreatments(rut2, long3, trans4, allig, pmlgth) {
    var i = 0;
    options = [];
    var strategy = {};
    var arrayLength = options.length;
    if ((allig > 5 && long3 > 5279) || trans4 > 1583 || rut2 > 0.26) {
      strategy = {
        title: "Thick HMA OVERLAY",
        cost: pmlgth * 280000,
        remarks: "Major"
      };
      options[i] = strategy.title + "    $" + Math.round(strategy.cost) + "    " + strategy.remarks;
      i++;
    }

    if (allig > 0 && rut2 > 0.26 && (long3 > 5279 || trans4 > 1583)) {
      strategy = {
        title: "Milling & Overlay",
        cost: pmlgth * 120000,
        remarks: "Major"
      };
      options[i] = strategy.title + "    $" + Math.round(strategy.cost) + "    " + strategy.remarks;
      i++;
    }

    if (rut2 > 0.26 && (long3 > 5279 || trans4 > 1583)) {
      strategy = {
        title: "Cold in Place Recycling",
        cost: pmlgth * 100000,
        remarks: "Major"
      };
      options[i] = strategy.title + "    $" + Math.round(strategy.cost) + "    " + strategy.remarks;
      i++;
    }

    if (rut2 > 0.26 && (long3 > 5279 || trans4 > 1583)) {
      strategy = {
        title: "Mill & Overlay with Cold in Place Recycling",
        cost: pmlgth * 150000,
        remarks: "Major"
      };
      options[i] = strategy.title + "    $" + Math.round(strategy.cost) + "    " + strategy.remarks;
      i++;
    }

    if (long3 > 5279 && trans4 > 1583) {
      strategy = {
        title: "Whitetopping",
        cost: pmlgth * 300000,
        remarks: "Major"
      };
      options[i] = strategy.title + "    $" + Math.round(strategy.cost) + "    " + strategy.remarks;
      i++;
    }

    if (rut2 > 0.26) {
      strategy = {
        title: "Milling only",
        cost: pmlgth * 10000,
        remarks: "Minor"
      };
      options[i] = strategy.title + "    $" + Math.round(strategy.cost) + "    " + strategy.remarks;
      i++;
    }

    if (long3 < 2040 && trans4 < 792) {
      strategy = {
        title: "Thin HMA Overlay",
        cost: pmlgth * 52000,
        remarks: "Minor"
      };
      options[i] = strategy.title + "    $" + Math.round(strategy.cost) + "    " + strategy.remarks;
      i++;
    }

    if (rut2 < 0.26 && long3 > 500 && long3 < 2640 && trans4 > 100 && trans4 < 792) {
      strategy = {
        title: "Chip Seal",
        cost: pmlgth * 22000,
        remarks: "Minor"
      };
      options[i] = strategy.title + "    $" + Math.round(strategy.cost) + "    " + strategy.remarks;
      i++;
    }
    if (rut2 < 0.26 && long3 > 500 && long3 < 2640 && trans4 > 100 && trans4 < 792) {
      strategy = {
        title: "Microsurfacing",
        cost: pmlgth * 45000,
        remarks: "Minor"
      };
      options[i] = strategy.title + "    $" + Math.round(strategy.cost) + "    " + strategy.remarks;
      i++;
    }
    if (rut2 < 0.26 && (long3 < 2640 || trans4 < 792)) {
      strategy = {
        title: "Milling and Chip Seal",
        cost: pmlgth * 26000,
        remarks: "Minor"
      };
      options[i] = strategy.title + "    $" + Math.round(strategy.cost) + "    " + strategy.remarks;
      i++;
    }
    if ((long3 > 100 && long3 < 2640) || (trans4 > 50 && trans4 < 792)) {
      strategy = {
        title: "Crack Seal/Fill",
        cost: pmlgth * 5280,
        remarks: "Preservation"
      };
      options[i] = strategy.title + "    $" + Math.round(strategy.cost) + "    " + strategy.remarks;
      i++;
    }

    if (allig > 0 && (long3 < 2040 || trans4 < 792)) {
      strategy = {
        title: "Patching",
        cost: pmlgth * 30000,
        remarks: "Localized"
      };
      options[i] = strategy.title + "    $" + Math.round(strategy.cost) + "    " + strategy.remarks;
      i++;
    }

    // loop through the array to append child to the innerHTML based on array length

    var content;
    arrayLength = options.length;
    //if array empty
    if (arrayLength < 1) {
      // insertAdjacentHTML() parses the specified text as HTML or XML and inserts the resulting nodes into the DOM tree at a specified position.

      dom.byId("msgs").innerHTML = "No treatments proposed.";
      // dom.byId("msgs").innerHTML = arrayLength;
    }

    // else loop through the array to append child to the innerHTML based on array length
    else {
      dom.byId("msgs").innerHTML = "<div id='container'></div>";
      var div_treat = dom.byId("container");
      for (var t = 0; t < arrayLength; t++) {
        // this preserves the current html while adding to it
        var position = t + 1;
        div_treat.insertAdjacentHTML("beforeend", "<strong>Option " + position + ":</strong><span class = 'stats'>" + options[t] + "</span><br>");
      }
    }
    //dom.byId("treat1").innerHTML = PaveType;
    // dom.byId("treat2").innerHTML = options[1];
    // dom.byId("treat3").innerHTML = options[2];

    dom.byId("treatments").style.display = "block";
  }

  function PCCtreatments(long5, trans6, dcrk, jsp, pmlgth) {
    var i = 0;
    options = [];
    var strategy = {};
    var arrayLength = options.length;
    if (long5 > 1319 && trans6 > 791) {
      strategy = {
        title: "Thick HMA OVERLAY with Crack and Seat",
        cost: pmlgth * 280000,
        remarks: "Major"
      };
      options[i] = strategy.title + "-------- $" + Math.round(strategy.cost) + "------------ " + strategy.remarks;
      i++;
    }

    if (long5 > 1319 && trans6 > 791) {
      strategy = {
        title: "Thick HMA OVERLAY with Rubblization",
        cost: pmlgth * 200000,
        remarks: "Major"
      };
      options[i] = strategy.title + "    $" + Math.round(strategy.cost) + "          " + strategy.remarks;
      i++;
    }

    if (long5 > 1319 || (trans6 > 791 && (dcrk < 5 || jsp < 5))) {
      strategy = {
        title: "Full Depth Repair",
        cost: pmlgth * 125000,
        remarks: "Localized"
      };
      options[i] = strategy.title + "    $" + Math.round(strategy.cost) + "         " + strategy.remarks;
      i++;
    }

    if (trans6 > 791) {
      strategy = {
        title: "Slab Replacement",
        cost: pmlgth * 100000,
        remarks: "Localized"
      };
      options[i] = strategy.title + "    $" + Math.round(strategy.cost) + "        " + strategy.remarks;
      i++;
    }

    if ((long5 < 1319 && long5 > 300) || (trans6 < 791 && trans6 > 200)) {
      strategy = {
        title: "Crack Sealing",
        cost: pmlgth * 5280,
        remarks: "Preservation"
      };
      options[i] = strategy.title + "    $" + Math.round(strategy.cost) + "       " + strategy.remarks;
      i++;
    }

    if (long5 < 500 || trans6 < 300) {
      strategy = {
        title: "Do Nothing",
        cost: 0,
        remarks: "No treatment proposed"
      };
      options[i] = strategy.title + "    $" + Math.round(strategy.cost) + "       " + strategy.remarks;
      i++;
    }

    // loop through the array to append child to the innerHTML based on array length

    var content;
    arrayLength = options.length;
    //if array empty
    if (arrayLength < 1) {
      // insertAdjacentHTML() parses the specified text as HTML or XML and inserts the resulting nodes into the DOM tree at a specified position.

      dom.byId("msgs").innerHTML = "No treatments proposed.";
      // dom.byId("msgs").innerHTML = arrayLength;
    }

    // else loop through the array to append child to the innerHTML based on array length
    else {
      dom.byId("msgs").innerHTML = "<div id='container'></div>";
      var div_treat = dom.byId("container");
      for (var t = 0; t < arrayLength; t++) {
        // this preserves the current html while adding to it
        var position = t + 1;
        div_treat.insertAdjacentHTML("beforeend", "<strong>Option " + position + ":</strong><span class = 'stats'>" + options[t] + "</span><br>");
      }
    }
    //dom.byId("treat1").innerHTML = PaveType;
    // dom.byId("treat2").innerHTML = options[1];
    // dom.byId("treat3").innerHTML = options[2];

    dom.byId("treatments").style.display = "block";
  }

  function removestuffs(testDiv) {
    testDiv.style.display = "none";
    while (testDiv.hasChildNodes()) testDiv.removeChild(testDiv.lastChild);
    testDiv.style.display = display;
  }

  function errback(err) {
    console.log("Couldn't retrieve summary statistics. ", err);
  }
});
