#!/bin/bash

CLASSPATH=".;C:/users/ambite/projects/source-modeling/code/SourceInduction/trunk/bin/lib/*;C:/users/ambite/projects/source-modeling/code/SourceInduction/trunk/bin/*;C:/users/ambite/projects/source-modeling/code/SourceInduction/trunk/bin"

EXPPATH="C:/users/ambite/projects/source-modeling/experiments/geospatial/2008-12-22"


for file in $( ls wrap* ); do
    echo $file
    echo java -classpath $CLASSPATH Tester "$EXPPATH/$file" "$EXPPATH/dbProperties.txt"
    java -classpath $CLASSPATH Tester "$EXPPATH/$file" "$EXPPATH/dbProperties.txt"
done

# java -classpath $CLASSPATH Tester "$EXPPATH/wrapcache_081222_no__geospatial51.txt" "$EXPPATH/dbProperties.txt"
