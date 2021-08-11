
import arcpy
import os
import re

# To allow overwriting the outputs change the overwrite option to true.
arcpy.env.overwriteOutput = True


Input_Feature_Class = 'Subset_ALL'
Field = arcpy.GetParameterAsText(0)
Value = arcpy.GetParameterAsText(1)
arcpy.SetParameter(2, Value)
Year = arcpy.GetParameterAsText(3)
ExtractSelection_zip = arcpy.GetParameterAsText(4).replace("\\", os.sep)
format = arcpy.GetParameterAsText(5);

if (format[:1] == 'G'):
    format = "File Geodatabase - GDB - .gdb"
else:
    format = "Shapefile - SHP - .shp"


# Local variables:
#Output_Feature_Class = r"C:\Users\aphares\Documents\ArcGIS\Projects\Download\Scratch\Scratch.gdb\OutputSelection"

Expression = ""

if (re.search('[a-zA-Z]', Value)):
    Value = Value.upper()
    Expression = Field + "=\'" + Value + "\'"
else:
    Expression = Field + "=" + Value

if (Year != 'Any'):
    Expression += ' AND YEAR=' + Year
arcpy.AddMessage("Expresion was " + Expression + " with format = " + format)

# Process: Select Layer By Attribute
SELECTION = arcpy.SelectLayerByAttribute_management(in_layer_or_view=Input_Feature_Class, selection_type="NEW_SELECTION", where_clause=Expression, invert_where_clause="")

# Process: Extract Data
arcpy.ExtractData_server(Layers_to_Clip=Input_Feature_Class, Area_of_Interest=SELECTION, Feature_Format=format, Raster_Format="ESRI GRID - GRID", Spatial_Reference="Same As Input", Custom_Spatial_Reference_Folder="", Output_Zip_File=ExtractSelection_zip)
