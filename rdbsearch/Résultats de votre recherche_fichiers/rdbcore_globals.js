// declare globals here

var g_curXHR;
var g_strcrit = "";
var g_searchOptionObject = null;
var g_formattedSearchOptions = "";
var g_numberOfResults = 0;
var g_numberOfPages = 0;
var g_numberOfDocsPerPage = 50;
var g_curSetPage = 1;
var g_curSortBy = "RELV";
var g_reload = 'true';
var g_facet = '';
var g_init = false;
var g_locid = 1;
var g_availableLocIDs = [2, 3];
var g_jobcatid = 1;
var g_st = "";
var g_langid = 1;
var g_resumedid = "";
var g_tagSelection = "";
var g_keywordUse = "ALL";
var g_userTags = [];
var g_clearancelevelid = 1;
var g_availableClearanceLevels = [2, 3];
var g_SiteCatalyst = "";
var g_softwarelevelid = 1;
var g_slicecode = '';

// LUCaches
var g_useListLUCache = null;
var g_freshnessListLUCache = null;
var g_radiusUnitsListLUCache = null;
var g_educationLUCache = null;
var g_languageLUCache = null;
var g_militaryExpLUCache = null;
var g_workStatusLUCache = null;
var g_nationalityLUCache = null;
var g_jchighestdegreeLUCache = null;
var g_securityClearanceLUCache = null;