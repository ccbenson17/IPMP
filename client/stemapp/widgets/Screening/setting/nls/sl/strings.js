﻿///////////////////////////////////////////////////////////////////////////
// Copyright © Esri. All Rights Reserved.
//
// Licensed under the Apache License Version 2.0 (the 'License');
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an 'AS IS' BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
///////////////////////////////////////////////////////////////////////////
define({
  "units": {
    "areaSquareFeetUnit": "Kvadratni čevlji",
    "areaAcresUnit": "Akri",
    "areaSquareMetersUnit": "Kvadratni metri",
    "areaSquareKilometersUnit": "Kvadratni kilometri",
    "areaHectaresUnit": "Hektari",
    "areaSquareMilesUnit": "Kvadratne milje",
    "lengthFeetUnit": "Čevlji",
    "lengthMilesUnit": "Milje",
    "lengthMetersUnit": "Metri",
    "lengthKilometersUnit": "Kilometri"
  },
  "analysisTab": {
    "analysisTabLabel": "Analiza",
    "selectAnalysisLayerLabel": "Sloji za analizo",
    "addLayerLabel": "Dodaj sloje",
    "noValidLayersForAnalysis": "V izbrani spletni karti ni najdenih veljavnih slojev.",
    "noValidFieldsForAnalysis": "V izbrani spletni karti ni najdenih veljavnih polj. Odstranite izbrani sloj.",
    "allowGroupingLabel": "Združi geoobjekte po poljih z enako vrednostjo",
    "groupingHintDescription": "Namig: po privzeti nastavitvi bodo vsi geoobjekti z enako vrednostjo za izbrana polja združeni, da se v poročilu pojavijo kot en vnos. Onemogočite združevanje po podobnih atributih, da prikažete vnos za vsak geoobjekt.",
    "addLayersHintText": "Namig: izberite sloje in polja, ki bodo vključeni v analizo in poročilo.",
    "addLayerNameTitle": "Ime sloja",
    "addFieldsLabel": "Dodaj polje",
    "addFieldsPopupTitle": "Izberi polja",
    "addFieldsNameTitle": "Imena polj",
    "aoiToolsLegendLabel": "Orodja interesnega območja",
    "aoiToolsDescriptionLabel": "Izberite in označite orodja, ki so na voljo za ustvarjanje interesnega območja.",
    "placenameLabel": "Ime kraja",
    "drawToolsLabel": "Izberite orodja za risanje",
    "uploadShapeFileLabel": "Naloži shapefile",
    "coordinatesLabel": "Koordinate",
    "coordinatesDrpDwnHintText": "Namig: izberite enoto za prikaz vnesenih traverz.",
    "coordinatesBearingDrpDwnHintText": "Namig: izberite smerni kot za prikaz vnesenih traverz.",
    "allowShapefilesUploadLabel": "Uporabnikom omogoči nalaganje shapefilov, ki bodo vključeni v analizo.",
    "allowShapefilesUploadLabelHintText": "Namig: dodajte možnost v zavihek Poročilo, kjer uporabniki lahko naložijo svoje lastne podatke kot shapefile za vključitev v poročilo analize.",
    "allowVisibleLayerAnalysisLabel": "Ne analiziraj ali poročaj o rezultatih za sloje, ki niso vidni",
    "allowVisibleLayerAnalysisHintText": "Namig: Sloji, ki so bili izklopljeni ali niso vidni zaradi nastavitev vidnosti merila, ne bodo analizirani ali vključeni v natisnjenih ali prenesenih rezultatih.",
    "areaUnitsLabel": "Enote za rezultate analize (območje)",
    "lengthUnitsLabel": "Enote za rezultate analize (dolžina)",
    "maxFeatureForAnalysisLabel": "Maksimalno število geoobjektov za analizo",
    "maxFeatureForAnalysisHintText": "Namig: nastavite maksimalno število geoobjektov, ki bodo vključeni v analizo.",
    "searchToleranceLabelText": "Toleranca iskanja",
    "searchToleranceHint": "Namig: toleranca iskanja se uporablja za analiziranje točkovnih in linijskih vhodnih podatkov.",
    "placenameButtonText": "Ime kraja",
    "drawToolsButtonText": "Riši",
    "shapefileButtonText": "Shapefile",
    "coordinatesButtonText": "Koordinate",
    "invalidLayerErrorMsg": "Konfiguriraj polja za",
    "drawToolSelectableLayersLabel": "Izberi med izberljivimi sloji",
    "drawToolSelectableLayersHint": "Namig: izberite sloje, ki vsebujejo geoobjekte, ki jih je mogoče izbrati s pomočjo funkcije »Izberi orodje za risanje«.",
    "drawToolsSettingsFieldsetLabel": "Orodja za risanje",
    "drawToolPointLabel": "Točka",
    "drawToolPolylineLabel": "Polilinija",
    "drawToolExtentLabel": "Obseg",
    "drawToolPolygonLabel": "Poligon",
    "drawToolCircleLabel": "Krog",
    "selectDrawToolsText": "Izberite orodja za risanje, ki so na voljo za ustvarjanje interesnega območja.",
    "selectingDrawToolErrorMessage": "Izberite vsaj eno orodje za risanje ali izbirni sloj za uporabo možnosti Orodja za risanje za orodja interesnega območja."
  },
  "downloadTab": {
    "downloadLegend": "Prenesi nastavitve",
    "reportLegend": "Nastavitve poročila",
    "downloadTabLabel": "Prenesi",
    "syncEnableOptionLabel": "Geoobjektni sloji",
    "syncEnableOptionHint": "Namig: izberite sloj, ki ga je mogoče prenesti in navedite formate, v katerih je posamezen sloj na voljo. Preneseni sklopi podatkov bodo vključevali tiste geoobjekte, ki se sekajo z interesnim območjem.",
    "syncEnableOptionNote": "Opomba: prenosi File Geodatabase in shapefile zahtevajo geoobjektne sloje z omogočeno sinhronizacijo. Format shapefile podpirajo le gostujoči geoobjektni sloji na ArcGIS Online.",
    "extractDataTaskOptionLabel": "Opravilo ekstrakcije podatkov geoprocesne storitve",
    "extractDataTaskOptionHint": "Namig: uporabite objavljeno geoprocesno storitev opravilo ekstrakcije podatkov za prenos geoobjektov, ki se sekajo z interesnim območjem v formatih File Geodatabase ali shapefile.",
    "cannotDownloadOptionLabel": "Onemogoči prenos",
    "syncEnableTableHeaderTitle": {
      "layerNameLabel": "Ime sloja",
      "csvFileFormatLabel": "CSV",
      "fileGDBFormatLabel": "File Geodatabase",
      "ShapefileFormatLabel": "Shapefile",
      "allowDownloadLabel": "Dovoli prenos"
    },
    "setButtonLabel": "Nastavi",
    "GPTaskLabel": "Določite url za geoprocesno storitev",
    "printGPServiceLabel": "URL storitve tiskanja",
    "setGPTaskTitle": "Določi zahtevan URL geoprocesne storitve",
    "logoLabel": "Logotip",
    "logoChooserHint": "Namig: kliknite ikono slike za spremembo logotipa, prikazanega v zgornjem levem kotu poročila.",
    "footnoteLabel": "Sprotna opomba",
    "columnTitleColorPickerLabel": "Barva imena stolpca poročila",
    "reportTitleLabel": "Ime poročila",
    "displaySummaryLabel": "Povzetek prikaza",
    "hideZeroValueRowLabel": "Skrijte vrstice z vrednostjo 0 za vsa polja za analizo",
    "hideNullValueRowLabel": "Skrijte vrstice s podatki brez vrednosti (brez vrednosti ali prazna) za vsa polja za analizo",
    "errorMessages": {
      "invalidGPTaskURL": "Neveljavna geoprocesna storitev Izberite geoprocesno storitev, ki vsebuje Opravilo ekstrakcije podatkov.",
      "noExtractDataTaskURL": "Izberite geoprocesno storitev, ki vsebuje Opravilo ekstrakcije podatkov.",
      "duplicateCustomOption": "Za ${duplicateValueSizeName} obstaja podvojen vnos.",
      "invalidLayoutWidth": "Vnesena je neveljavna širina za ${customLayoutOptionValue}.",
      "invalidLayoutHeight": "Vnesena je neveljavna višina za ${customLayoutOptionValue}.",
      "invalidLayoutPageUnits": "Za ${customLayoutOptionValue} je izbrana neveljavna merska enota strani.",
      "failtofetchbuddyTaskDimension": "Napaka pri pridobivanju informacij o dimenziji povezanega opravila. Poskusite znova.",
      "failtofetchbuddyTaskName": "Napaka pri pridobivanju imena povezanega opravila. Poskusite znova.",
      "failtofetchChoiceList": "Napaka pri pridobivanju seznama za izbiro iz storitve tiskanja. Poskusite znova.",
      "invalidWidth": "Neveljavna širina",
      "invalidHeight": "Neveljavna višina"
    },
    "addCustomLayoutTitle": "Dodaj postavitev po meri",
    "customLayoutOptionHint": "Namig: v storitvi tiskanja dodajte postavitev na seznam možnosti tiskanja.",
    "reportDefaultOptionLabel": "Privzeta postavitev",
    "pageSizeUnits": {
      "millimeters": "Milimetri",
      "points": "Točke"
    },
    "noDataTextRepresentation": "Podatki brez vrednosti",
    "naTextRepresentation": "Ni na voljo vrednosti",
    "noDataDefaultText": "Ni podatkov",
    "notApplicableDefaultText": "ni na voljo"
  },
  "generalTab": {
    "generalTabLabel": "Splošno",
    "tabLabelsLegend": "Napisi plošče",
    "tabLabelsHint": "Namig: Določi napise",
    "AOITabLabel": "Plošča interesnega območja",
    "ReportTabLabel": "Plošča poročila",
    "bufferSettingsLegend": "Nastavitve obrisa",
    "defaultBufferDistanceLabel": "Privzeta razdalja obrisa",
    "defaultBufferUnitsLabel": "Enote obrisa",
    "generalBufferSymbologyHint": "Namig: simbologija, ki se uporablja za označevanje območja obrisa okoli določenega interesnega območja",
    "aoiGraphicsSymbologyLegend": "Simbologija interesnega območja",
    "aoiGraphicsSymbologyHint": "Namig: simbologija za označevanje točkovnih, linijskih in poligonskih interesnih območij",
    "pointSymbologyLabel": "Točka",
    "previewLabel": "Predogled",
    "lineSymbologyLabel": "Linija",
    "polygonSymbologyLabel": "Poligon",
    "aoiBufferSymbologyLabel": "Simbologija obrisa",
    "pointSymbolChooserPopupTitle": "Simbol naslova ali točke lokacije",
    "polygonSymbolChooserPopupTitle": "Simbol poligona",
    "lineSymbolChooserPopupTitle": "Linijski simbol",
    "aoiSymbolChooserPopupTitle": "Simbol obrisa",
    "aoiTabText": "Interesno območje",
    "reportTabText": "Poročilo",
    "invalidSymbolValue": "Neveljavna vrednost simbola."
  },
  "searchSourceSetting": {
    "searchSourceSettingTabTitle": "Nastavitve vira iskanja",
    "searchSourceSettingTitle": "Nastavitve vira iskanja",
    "searchSourceSettingTitleHintText": "Dodajte in konfigurirajte geokodirne storitve ali geoobjektne sloje kot vire iskanja. Ti viri določajo, kaj je mogoče iskati znotraj iskalnega polja.",
    "addSearchSourceLabel": "Dodajte vir iskanja",
    "featureLayerLabel": "Geoobjektni sloj",
    "geocoderLabel": "Geokodirnik",
    "generalSettingLabel": "Splošna nastavitev",
    "allPlaceholderLabel": "Nadomestno besedilo za iskanje:",
    "allPlaceholderHintText": "Namig: Vnesite besedilo, ki bo prikazano kot nadomestno besedilo med iskanjem po vseh slojih in geokodirniku",
    "generalSettingCheckboxLabel": "Pokaži pojavno okno za najdeni geoobjekt ali lokacijo",
    "countryCode": "Šifre države ali regije",
    "countryCodeEg": "npr. ",
    "countryCodeHint": "Če to vrednost pustite prazno, bo iskanje potekalo po vseh državah in regijah",
    "questionMark": "?",
    "searchInCurrentMapExtent": "Išči samo v trenutnem obsegu karte",
    "locatorUrl": "URL geokodirnika",
    "locatorName": "Ime geokodirnika",
    "locatorExample": "Primer",
    "locatorWarning": "Ta različica geokodirnih storitev ni podprta. Pripomoček podpira različico geokodirne storitve 10.0 in novejšo.",
    "locatorTips": "Predlogi niso na voljo, ker geokodirna storitev ne podpira možnosti predlogov.",
    "layerSource": "Vir sloja",
    "setLayerSource": "Nastavi vir sloja",
    "setGeocoderURL": "Nastavi URL geokodirnika",
    "searchLayerTips": "Predlogi niso na voljo, ker geoobjektna storitev ne podpira možnost številčenje strani.",
    "placeholder": "Nadomestno besedilo",
    "searchFields": "Iskalna polja",
    "displayField": "Prikaži polje",
    "exactMatch": "Natančno ujemanje",
    "maxSuggestions": "Maksimalno predlogov",
    "maxResults": "Maksimalno rezultatov",
    "enableLocalSearch": "Omogoči lokalno iskanje",
    "minScale": "Minimalno merilo",
    "minScaleHint": "Ko je merilo karte večje od tega merila, bo uporabljeno lokalno iskanje",
    "radius": "Polmer",
    "radiusHint": "Določa polmer območja okrog trenutnega središča karte, ki je uporabljeno za povečanje števila kandidatov za geokodiranje, tako da so najprej prikazani kandidati, ki so najbližji lokaciji",
    "setSearchFields": "Nastavi iskalna polja",
    "set": "Nastavi",
    "invalidUrlTip": "URL ${URL} ni veljaven ali dostopen.",
    "invalidSearchSources": "Neveljavne nastavitve vira iskanja"
  },
  "errorMsg": {
    "textboxFieldsEmptyErrorMsg": "Izpolnite obvezna polja.",
    "bufferDistanceFieldsErrorMsg": "Vnesite veljavne vrednosti",
    "invalidSearchToleranceErrorMsg": "Vnesite veljavno vrednost odstopanja pri iskanju",
    "atLeastOneCheckboxCheckedErrorMsg": "Neveljavna konfiguracija: zahtevano je vsaj eno orodje interesnega območja.",
    "noLayerAvailableErrorMsg": "Sloji niso na voljo",
    "layerNotSupportedErrorMsg": "Ni podprto ",
    "noFieldSelected": "Uporabite dejanje urejanja za izbiro polja za analizo",
    "duplicateFieldsLabels": "Podvoji napis »${labelText}«, dodan za : »${itemNames}«",
    "noLayerSelected": "Izberite vsaj en sloj za analizo.",
    "errorInSelectingLayer": "Sloja ni mogoče izbrati. Poskusite znova.",
    "errorInMaxFeatureCount": "Vnesite maksimalno število geoobjektov za analizo."
  }
});