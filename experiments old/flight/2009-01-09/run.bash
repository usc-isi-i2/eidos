#!/bin/bash

CLASSPATH=".;C:/users/ambite/projects/source-modeling/code/SourceInduction/trunk/bin/lib/*;C:/users/ambite/projects/source-modeling/code/SourceInduction/trunk/bin/*;C:/users/ambite/projects/source-modeling/code/SourceInduction/trunk/bin"

EXPPATH="C:/users/ambite/projects/source-modeling/experiments/flight/2009-01-09"

echo WITHOUT VARIABLE REPETITION

for file in $( ls wrap* ); do
    echo $file
    echo java -classpath $CLASSPATH Tester "$EXPPATH/$file" "$EXPPATH/dbProperties.txt" true
    time java -classpath $CLASSPATH Tester "$EXPPATH/$file" "$EXPPATH/dbProperties.txt" true
done

