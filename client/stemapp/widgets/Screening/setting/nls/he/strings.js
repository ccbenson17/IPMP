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
    "areaSquareFeetUnit": "רגל רבוע",
    "areaAcresUnit": "אקרים",
    "areaSquareMetersUnit": "מטרים רבועים",
    "areaSquareKilometersUnit": "קילומטרים רבועים",
    "areaHectaresUnit": "הקטרים",
    "areaSquareMilesUnit": "מילים רבועים",
    "lengthFeetUnit": "רגליים",
    "lengthMilesUnit": "מייל",
    "lengthMetersUnit": "מטרים",
    "lengthKilometersUnit": "קילומטרים"
  },
  "analysisTab": {
    "analysisTabLabel": "ניתוח",
    "selectAnalysisLayerLabel": "שכבות ניתוח",
    "addLayerLabel": "הוסף שכבות",
    "noValidLayersForAnalysis": "לא נמצאו שכבות חוקיות ב-Webmap שנבחרה.",
    "noValidFieldsForAnalysis": "לא נמצאו שדות חוקיים ב-Webmap שנבחר. הסר את השכבה שנבחרה.",
    "allowGroupingLabel": "קבץ ישויות לפי שדה עם אותו ערך",
    "groupingHintDescription": "עצה: כברירת מחדל, כל הישויות עם אותו ערך עבור השדות שנבחרו יקובצו כדי להיראות כרשומה אחת בדוח. השבת קיבוץ לפי מאפיינים דומים כדי להציג רשומה עבור כל ישות במקום זאת.",
    "addLayersHintText": "רמז: בחר את השכבות והשדות שייכללו בניתוח ובדוח",
    "addLayerNameTitle": "שם שכבה",
    "addFieldsLabel": "הוסף שדה",
    "addFieldsPopupTitle": "בחר שדות",
    "addFieldsNameTitle": "שמות השדות",
    "aoiToolsLegendLabel": "כלים של אזור עניין",
    "aoiToolsDescriptionLabel": "בחר את הכלים הזמינים ליצירת אזור עניין ותן להם תוויות.",
    "placenameLabel": "שם מקום",
    "drawToolsLabel": "בחר כלי שרטוט",
    "uploadShapeFileLabel": "העלה Shapefile",
    "coordinatesLabel": "קואורדינטות",
    "coordinatesDrpDwnHintText": "רמז: בחר יחידה כדי להציג צלעונים שהוזנו",
    "coordinatesBearingDrpDwnHintText": "רמז: בחר כיוון כדי להציג צלעונים שהוזנו",
    "allowShapefilesUploadLabel": "אפשר למשתמשים להעלות shapefiles שייכללו בניתוח",
    "allowShapefilesUploadLabelHintText": "רמז: הוסף אפשרות לכרטיסיית הדוח שבה משתמשים יוכלו להעלות את הנתונים שלהם בצורת shapefile כדי לכלול בדוח הניתוח",
    "allowVisibleLayerAnalysisLabel": "אל תנתח או תדווח תוצאות עבור שכבות שאינן גלויות",
    "allowVisibleLayerAnalysisHintText": "רמז: השכבות שכובו או שאינן גלויות עקב הגדרות הנראות לפי קנה מידה לא ינותחו ולא ייכללו בתוצאות להדפסה או להורדה.",
    "areaUnitsLabel": "יחידות לתוצאות הניתוח (שטח)",
    "lengthUnitsLabel": "יחידות לתוצאות הניתוח (אורך)",
    "maxFeatureForAnalysisLabel": "מספר מקסימלי של ישויות לניתוח",
    "maxFeatureForAnalysisHintText": "רמז: הגדר את המספר המקסימלי של ישויות שייכללו בניתוח",
    "searchToleranceLabelText": "סטייה מותרת בחיפוש",
    "searchToleranceHint": "רמז: טולרנס החיפוש משמש בעת ניתוח קלט מסוג נקודה וקו",
    "placenameButtonText": "שם מקום",
    "drawToolsButtonText": "ציור",
    "shapefileButtonText": "Shapefile",
    "coordinatesButtonText": "קואורדינטות",
    "invalidLayerErrorMsg": "הגדר את השדות עבור",
    "drawToolSelectableLayersLabel": "בחר שכבות הניתנות לבחירה",
    "drawToolSelectableLayersHint": "רמז: בחר את השכבות שמכילות את הישויות שניתן לבחור באמצעות כלי הבחירה",
    "drawToolsSettingsFieldsetLabel": "כלי ציור",
    "drawToolPointLabel": "נקודה",
    "drawToolPolylineLabel": "פולי קו",
    "drawToolExtentLabel": "תיחום",
    "drawToolPolygonLabel": "פוליגון",
    "drawToolCircleLabel": "מעגל",
    "selectDrawToolsText": "בחר את כלי השרטוט הזמינים ליצירת אזור עניין ותן להם תוויות",
    "selectingDrawToolErrorMessage": "בחר לפחות כלי שרטוט אחד או שכבת בחירה כדי להשתמש באפשרות כלי השרטוט עבור כלי AOI."
  },
  "downloadTab": {
    "downloadLegend": "הורדת הגדרות",
    "reportLegend": "הגדרות דוח",
    "downloadTabLabel": "הורדה",
    "syncEnableOptionLabel": "שכבות ישויות",
    "syncEnableOptionHint": "רמז: בחר את השכבות שניתן להוריד וציין את הפורמט שבו כל שכבה תהיה זמינה. סט נתונים שניתן להוריד יכלול את הישויות שחותכות את אזור העניין.",
    "syncEnableOptionNote": "הערה: הורדות של File geodatabase או קובצי shapefile דורשות שכבות ישויות שניתנות לסנכרון. פורמט shapefile נתמך רק בשכבות ישויות שמתארחות ב-ArcGIS Online.",
    "extractDataTaskOptionLabel": "שירות geoprocessing של משימת חילוץ נתונים",
    "extractDataTaskOptionHint": "רמז: השתמש בשירות geoprocessing מפורסם של משימת חילוץ נתונים כדי להוריד ישויות שמצטלבות עם אזור העניין בתבניות File Geodatabase או Shapefile.",
    "cannotDownloadOptionLabel": "השבת הורדה",
    "syncEnableTableHeaderTitle": {
      "layerNameLabel": "שם שכבה",
      "csvFileFormatLabel": "CSV",
      "fileGDBFormatLabel": "File Geodatabase",
      "ShapefileFormatLabel": "Shapefile",
      "allowDownloadLabel": "אפשר הורדה"
    },
    "setButtonLabel": "הגדר",
    "GPTaskLabel": "ציין url לשירות geoprocessing",
    "printGPServiceLabel": "URL של שירות הדפסה",
    "setGPTaskTitle": "ציין URL של שירות Geoprocessing נדרש",
    "logoLabel": "לוגו",
    "logoChooserHint": "רמז: לחץ על סמל התמונה כדי לשנות את הלוגו שמופיע בפינה השמאלית העליונה של הדוח",
    "footnoteLabel": "הערת שוליים",
    "columnTitleColorPickerLabel": "צבע לכותרת עמודת הדוח",
    "reportTitleLabel": "כותרת דוח",
    "displaySummaryLabel": "הצג סיכום",
    "hideZeroValueRowLabel": "הסתר שורות עם ערך 0 עבור כל שדות הניתוח",
    "hideNullValueRowLabel": "הסתר שורות ללא ערך נתונים (null או ריק) עבור כל שדות הניתוח",
    "errorMessages": {
      "invalidGPTaskURL": "שירות geoprocessing לא חוקי. בחר שירות geoprocessing שמכיל משימת חילוץ נתונים.",
      "noExtractDataTaskURL": "בחר שירות geoprocessing שמכיל משימת חילוץ נתונים.",
      "duplicateCustomOption": "קיים ערך כפול של  ‎${duplicateValueSizeName}‎.",
      "invalidLayoutWidth": "הוזן רוחב לא חוקי עבור ‎${customLayoutOptionValue}‎.",
      "invalidLayoutHeight": "הוזן גובה לא חוקי עבור ‎${customLayoutOptionValue}‎.",
      "invalidLayoutPageUnits": "נבחרה יחידת דף לא חוקית עבור ‎${customLayoutOptionValue}‎.",
      "failtofetchbuddyTaskDimension": "אירעה שגיאה במהלך קבלת פרטי הממדים של משימה חברה. נסה שוב.",
      "failtofetchbuddyTaskName": "אירעה שגיאה במהלך קבלת שם המשימה החברה. נסה שוב.",
      "failtofetchChoiceList": "אירעה שגיאה במהלך קבלת רשימת האפשרויות משירות ההדפסה. נסה שוב.",
      "invalidWidth": "רוחב לא חוקי.",
      "invalidHeight": "גובה לא חוקי."
    },
    "addCustomLayoutTitle": "הוסף פריסה מותאמת אישית",
    "customLayoutOptionHint": "רמז: הוסף פריסה משירות ההדפסה שלך לרשימת אפשרויות ההדפסה.",
    "reportDefaultOptionLabel": "פריסת ברירת מחדל",
    "pageSizeUnits": {
      "millimeters": "מילימטרים",
      "points": "נקודות"
    },
    "noDataTextRepresentation": "אין ערך לנתון",
    "naTextRepresentation": "ערך לא רלוונטי",
    "noDataDefaultText": "אין נתונים",
    "notApplicableDefaultText": "לא זמין"
  },
  "generalTab": {
    "generalTabLabel": "כללי",
    "tabLabelsLegend": "תווית של פאנל",
    "tabLabelsHint": "רמז: ציין תוויות",
    "AOITabLabel": "פאנל אזור עניין",
    "ReportTabLabel": "פאנל הדוח",
    "bufferSettingsLegend": "הגדרות חיץ",
    "defaultBufferDistanceLabel": "מרחק ברירת מחדל לחיץ",
    "defaultBufferUnitsLabel": "יחידות חיץ",
    "generalBufferSymbologyHint": "רמז: הסימבולוגיה שתשמש לציון אזור החיץ מסביב לאזור העניין שהוגדר",
    "aoiGraphicsSymbologyLegend": "סימבולוגיה של אזור העניין",
    "aoiGraphicsSymbologyHint": "רמז: הסימבולוגיה שתשמש לציון נקודה, קו ופוליגון של אזורי העניין",
    "pointSymbologyLabel": "נקודה",
    "previewLabel": "תצוגה מקדימה",
    "lineSymbologyLabel": "קו",
    "polygonSymbologyLabel": "פוליגון",
    "aoiBufferSymbologyLabel": "סימבולוגיית חיץ",
    "pointSymbolChooserPopupTitle": "סמל כתובת או מיקום",
    "polygonSymbolChooserPopupTitle": "סמל של פוליגון",
    "lineSymbolChooserPopupTitle": "סמל קווי",
    "aoiSymbolChooserPopupTitle": "סמל חיץ",
    "aoiTabText": "AOI",
    "reportTabText": "דוח",
    "invalidSymbolValue": "ערך סמל לא חוקי."
  },
  "searchSourceSetting": {
    "searchSourceSettingTabTitle": "חפש הגדרות מקור",
    "searchSourceSettingTitle": "חפש הגדרות מקור",
    "searchSourceSettingTitleHintText": "הוסף והגדר שירותי עיגון כתובות או שכבות ישויות כמקורות חיפוש. מקורות אלה שמצוינים קובעים מה ניתן לחיפוש בתוך תיבת החיפוש",
    "addSearchSourceLabel": "הוסף מקור חיפוש",
    "featureLayerLabel": "שכבת ישויות",
    "geocoderLabel": "מעגן כתובות",
    "generalSettingLabel": "הגדרה כללית",
    "allPlaceholderLabel": "טקסט מציין מיקום לחיפוש מלא:",
    "allPlaceholderHintText": "רמז: הקלד טקסט שיוצג כממלא מקום בעת חיפוש בכל השכבות ומעגן הכתובות",
    "generalSettingCheckboxLabel": "הצג חלון קופץ עבור הישות או המיקום שנמצאו",
    "countryCode": "קוד/ים של ארצות או אזורים",
    "countryCodeEg": "לדוגמה ",
    "countryCodeHint": "השארת הערך הזה ריק תפעיל חיפוש בכל הארצות והאזורים",
    "questionMark": "?",
    "searchInCurrentMapExtent": "חפש רק בתיחום המפה הנוכחי",
    "locatorUrl": "URL של מעגן הכתובות",
    "locatorName": "שם מעגן הכתובות",
    "locatorExample": "דוגמה",
    "locatorWarning": "גרסה זו של שירות עיגון הכתובות אינה נתמכת. הווידג'ט תומך בשירות עיגון הכתובות בגרסה 10.0 ואילך.",
    "locatorTips": "אין הצעות זמינות מפני ששירות עיגון הכתובות אינו תומך ביכולת הצעה.",
    "layerSource": "מקור שכבה",
    "setLayerSource": "הגדר מקור שכבה",
    "setGeocoderURL": "הגדר URL של מעגן הכתובות",
    "searchLayerTips": "אין הצעות זמינות מפני ששירות התמיכה אינו תומך ביכולת עימוד.",
    "placeholder": "טקסט מציין מיקום (Placeholder)",
    "searchFields": "שדות חיפוש",
    "displayField": "שדה תצוגה",
    "exactMatch": "התאמה מדויקת",
    "maxSuggestions": "מקסימום הצעות",
    "maxResults": "מקסימום תוצאות",
    "enableLocalSearch": "הפעל חיפוש מקומי",
    "minScale": "קנ\"מ מינימלי",
    "minScaleHint": "כאשר קנה המידה גדול יותר מקנה מידה זה, החיפוש המקומי יבוצע",
    "radius": "רדיוס",
    "radiusHint": "מציין את רדיוס האזור מסביב למרכז המפה הנוכחית שמשמש להגדלת הדירוג של מועמדים לעיגון כתובות, כך שהמועמדים הקרובים ביותר למיקום יוחזרו ראשונים.",
    "setSearchFields": "הגדר שדות חיפוש",
    "set": "הגדר",
    "invalidUrlTip": "ה-URL ‏${URL} שגוי או אינו נגיש.",
    "invalidSearchSources": "הגדרות חיפוש מקור לא חוקיות"
  },
  "errorMsg": {
    "textboxFieldsEmptyErrorMsg": "השלם את השדות הדרושים",
    "bufferDistanceFieldsErrorMsg": "הזן ערכים חוקיים",
    "invalidSearchToleranceErrorMsg": "הזן ערך חוקי עבור טולרנס חיפוש",
    "atLeastOneCheckboxCheckedErrorMsg": "תצורה לא חוקית: נדרש כלי אחד לפחות של אזור עניין.",
    "noLayerAvailableErrorMsg": "אין שכבות זמינות",
    "layerNotSupportedErrorMsg": "לא נתמך ",
    "noFieldSelected": "השתמש בפעולת העריכה כדי לבחור שדות לניתוח.",
    "duplicateFieldsLabels": "תווית כפולה \"${labelText}\" התווספה עבור : \"${itemNames}\"",
    "noLayerSelected": "בחר שכבה אחת לפחות לניתוח.",
    "errorInSelectingLayer": "לא ניתן לבחור שכבה. נסה שוב.",
    "errorInMaxFeatureCount": "הזן ספירת ישויות מקסימלית חוקית לניתוח."
  }
});