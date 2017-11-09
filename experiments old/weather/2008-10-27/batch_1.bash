#! /usr/bin/bash -f
#

EIDOS=/cygdrive/c/users/ambite/projects/source-modeling/code/SourceInduction/trunk

EXPDIRUNIX=/cygdrive/c/users/ambite/projects/source-modeling/experiments/weather/2008-10-27

EXPDIRDOS='C:\users\ambite\projects\source-modeling\experiments\weather\2008-10-27'

EIDOS='C:\users\ambite\projects\source-modeling\code\SourceInduction\trunk\bin\lib'


CLASS=Tester

# $CLASSPATH
CP=. 
# echo $CP

# for f in `find /cygdrive/c/users/ambite/projects/source-modeling/code/SourceInduction/trunk -name "*.jar"`; do
#     # echo $f
#     CP=$CP\,$f
# done

# echo $CP

$CP='.,$EIDOSBIN\lib\json.jar,$EIDOSBIN\lib\msbase.jar,$EIDOSBIN\lib\mssqlserver.jar,$EIDOSBIN\lib\msutil.jar,$EIDOSBIN\lib\mysql-connector-java-3.1.11-bin.jar,$EIDOSBIN\lib\secondstring-20040722.jar,$EIDOSBIN\sourceInduction.jar,C:\users\ambite\projects\source-modeling\code\SourceInduction\trunk\lib\json.jar,C:\users\ambite\projects\source-modeling\code\SourceInduction\trunk\lib\msbase.jar,C:\users\ambite\projects\source-modeling\code\SourceInduction\trunk\lib\mssqlserver.jar,C:\users\ambite\projects\source-modeling\code\SourceInduction\trunk\lib\msutil.jar,C:\users\ambite\projects\source-modeling\code\SourceInduction\trunk\lib\mysql-connector-java-3.1.11-bin.jar,C:\users\ambite\projects\source-modeling\code\SourceInduction\trunk\lib\secondstring-20040722.jar,C:\users\ambite\projects\source-modeling\code\SourceInduction\trunk\sourceInduction.jar'

cd $CODEDIR

#java -classpath "$CP" -Xmx1024m $CLASS $EXPDIRDOS\\weather6.txt >& $EXPDIRUNIX/weather6.log &

java -classpath "$CP" -Xmx1024m $CLASS $EXPDIRDOS\\weather6.txt

