#! /usr/bin/bash -f
#

EIDOS=/cygdrive/c/users/ambite/projects/source-modeling/code/SourceInduction/trunk

EXP=/cygdrive/c/users/ambite/projects/source-modeling/experiments/weather/2008-10-27

# EXPDIRDOS='C:\users\ambite\projects\source-modeling\experiments\weather\2008-10-27'

# EIDOS='C:\users\ambite\projects\source-modeling\code\SourceInduction\trunk\bin\lib'



#$CLASSPATH
CP=. 

for f in `find /cygdrive/c/users/ambite/projects/source-modeling/code/SourceInduction/trunk/lib -name "*.jar"`; do
    # echo $f
    CP=$CP:$f
done

echo $CP


cd $EIDOS

echo `pwd`

#java -classpath "$CP" -Xmx1024m $CLASS $EXPDIRDOS\\weather6.txt >& $EXPDIRUNIX/weather6.log &

echo java -classpath $CP -Xmx1024m Tester $EIDOS/weather6.txt

java -classpath "$CP" -Xmx1024m Tester $EXP/weather6.txt




unk/weather6.txt