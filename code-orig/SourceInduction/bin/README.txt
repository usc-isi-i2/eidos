************************************************************************************
README file for the EIDOS Source Induction System
************************************************************************************

    Author:
    Mark James Carman
    Information Sciences Institute,
    University of Southern California

    Updated: 6/3/2007


EIDOS: Efficiently Inducing Definitions for Online Sources
----------------------------------------------------------

1. Abstract:
------------

This README provides a simple tutorial on how to install and use the source induction system. A description of the theory behind the workings of the system can be found in the following publications:

Learning Semantic Descriptions of Web Information Sources,
Mark James Carman and Craig A. Knoblock.
In Proceedings of the Twentieth International Joint Conference on Artificial Intelligence (IJCAI-07). Hyderabad, India, January 2007.

Learning Semantic Definitions of Information Sources on the Internet,
Mark James Carman.
Doctorate Thesis, (Advisors: Paolo Traverso and Craig A. Knoblock),
Department of Information and Communication Technologies,
University of Trento, August 2006.

These publications are available from Mark Carman's webpage at: http://bradipo.net/mark/


2. Installation:
----------------


2.1 Prerequisites:
----------------------------------------

Installing the Source Induction system is quite simple. You will, however, need to have the following installed on your machine:

- Java Runtime Environment 1.5 or higher

You will also need to have access to a machine running:

- MySQL 5.0 or higher (Other SQL compatible relational database implementations should work - see discussion below)


2.2 Configuring the Database Connection:
----------------------------------------

In order to induce source definitions the system will need access to a relational database implementation. You must select the database implementation that will be used by the system by changing the parameters of the file "dbProperties.txt". You will need to set the following properties:

- jdbcDriver (the java class that implements the JDBC driver for your implementation)
- dbURL (the URL of the database instance, in standard JDBC format)
- dbUser (the username for accessing the database server)
- dbPassword (the password)

We recommend that you use MySQL 5.0 or later as a database. While the system has been designed to work with other relational database implementations, (in particular SQLServer), it has not been tested on them and inconsistencies in the SQL used by each may cause problems.

As an example, in order to use a MySQL database running on a server called "ragnarok.isi.edu", with a username "root" and password "secret", (and setting the default schema to be "db4"), you would need to add the following to the "dbProperties.txt" file:

jdbcDriver=com.mysql.jdbc.Driver
dbURL=jdbc\:mysql\://ragnarok.isi.edu/db4
dbUser=root
dbPassword=secret


3. Using the Source Induction System:
-------------------------------------

Once you have installed/configured the source induction system you can start using it. To use the system you must create a problem specification file and you must write wrapper classes for all the sources (both known and unknown) in the specification file. (In the future we hope to automate the wrapper generating process.) The problem specification file is discussed in section 4 and the wrapper writing process in section 5.

To run the system, call:
    java -jar sourceInduction.jar <problem_filename>

Sample problem files are available in "problems" folder. If no problem file is given, the system will execute the default problem "problems/example.txt".

Note that in order to run this and other sample problems you will first need to fill the database with example data found in the file "data/examples.sql". The file contains a series of SQL commands that create a set of tables containing examples of different Semantic Types (that are needed for the induction process). To load the database just execute the SQL script using any database management software (such as the "MySQL Query Browser").


4. The Problem Specification File:
-----------------------------------

In EIDOS, problems are specified in a text file. A typical problem specification file will contain declarations for semantic types, domain relations, comparison predicates, known sources and target predicates (usually in that order).

Declarations begin with one of the following keywords:
    {type, relation, comparison, source, function, target, import}.

Each declaration must be on a separate line. (Declarations cannot run across lines.)

The "#" character is used to escape comments. The rest of the line following the "#" character is ignored by the parser.


4.1 Semantic Types:
---------------------

The first thing to define in a problem specification file is the set of semantic types that will be used to describe the data that is required as input and produced as output by different sources. Semantic types (like "phoneNumber" and "hotelName") differ from syntactic types (like "string" and "integer") in that the domain of their values is typically much smaller, and comparing their values makes sense. (For example, it makes sense to check if two phone numbers are equal, but not whether a phone number equals a zipcode, even though they are both just integers.) Syntactically, a type declaration is written as follows:

    type name [primitive_type] {additional_type_parameters}

Each declaration starts with the "type" keyword, followed by the name of the type, then in square brackets the primitive type (that is used to define columns in the database), followed by additional type parameters in curly-braces (that define the domain and/or provide examples of the type). Two example semantic type declarations are shown below:

    type latitude [varchar(20)] {numeric: -90.0, 90.0, 0.002}
    type speedKmph [varchar(45)] {numeric: 0.0, 1000.0, 1.0%}

The first type "latitude" is a numeric type, taking values from the range -90.0 to +90.0. The third parameter 0.002 is the tolerance. The induction system will consider two latitude values to be the same if they fall within 0.002 of each other. The tolerance can also be given as a relative value (percentage) as is the case for the second numeric type "speedKmph".

Semantic types can also be nominal, meaning that the set of possible values do not come from a range:

    type countryName [varchar(100)] {examples: examples.countryname.val}

In this case, a set of example values can be given to the system for use when querying sources. For the "countryName" type shown above, the example values are found in a database called "examples" in the "val" column of a table called "countryname".

One does not necessarily need to provide example values for all types. Any types declared without additional parameters will be assumed to be nominal and exact string matching will be used for checking equality between values. E.g.:

    type direction [varchar(30)]

We do not recommend declaring types without additional information however, as it may lead to errors during the induction process. Basically, if the system ever needs to generate input values of type "direction" an error will be returned and the induction process will fail.

For some (nominal) semantic types, certain values from their domain are far more more common than others. In such cases it usually makes sense for the induction system to invoke services using the more common values than the less common ones. Consider for example a service providing classified listings of used cars for sale in a given area. If the system invokes the service using a common car manufacturer like "Toyota", the service is likely to return some cars, while if it invokes it with a less common manufacturer like "Ferrari", it is unlikely that any cars will be found. Thus it makes sense for some semantic types (like "carMake") to provide information regarding the frequency of different example values:

    type carMake [varchar(100)] {examples: examples.cars.manufacturer[frequency]}

The above declaration states that example values for type "carMake" can be found in the "examples" database in the "manufacturer" column of the "cars" table. In addition, the relative frequency (or count) of each example is found in the column "frequency" of the same table. (Note that the sum of values in the "frequency" doesn't need to be 1.)

In the same way that we allow flexibility in the exact value of a numeric attribute like "Temperature" (by giving a tolerance), we would like to allow some flexibility in the value of a nominal attribute like "company". In other words, we would like strings like "Google Inc." and "Google Incorporated" to match one another even though they are not exactly the same.
Deciding which strings match and which don't can be difficult (consider "Google Incorporated" and "Yahoo Incorporated" for instance - both contain the same substring). To decide for a given type whether two strings refer to the same entity we use string similarity scores (that are usually related to the edit distance between strings). A commonly used similarity score is the JaroWinkler score:

    type company [varchar(80)] {examples: examples.company.val; equality: JaroWinkler > 0.85}

The above declaration states that the system will consider two strings of type "company" to refer to the same entity if the JaroWinkler score for the two strings is greater than 0.85.
String distance scores are calculated using the SecondString package (http://secondstring.sourceforge.net/), so you can choose to use other similarity scores provided by that software. (Note however, that JaroWinkler is the only similarity score that has so far been tested in EIDOS. Furthermore, some of the similarity scores such as TFIDF, require examples of different strings to be given apriori and are not as yet supported by the EIDOS code).

Some semantic types (like "date") have complex structure which needs to be taken into account when deciding if two values are equal. In that case the user can write special code for deciding on equality between strings and have the system invoke that code as it would a string similarity measure:

    type date [varchar(80)] {equality: Date = 1.0}

The above declaration states that two strings can only be considered equal if a handwritten procedure called "Date" returns 1. (Currently "Date" is the only handwritten procedure available in EIDOS.)


4.2 Domain Relations:
-----------------------

Having declared the types, we need to declare the relations that can be used to express semantic relationships between variables of different types. These relations define the mediated schema. (The language that the user uses to write queries for the information mediator.) Each declaration consists of a relation name and a set of semantic types, (which must have been declared previously in the problem specification), such as the following:

    relation centroid(zipcode, latitude, longitude)

Relations may be very long and contain multiple occurrences of the same type:

    relation forecast(latitude,longitude,date,temperatureF,temperatureF,sky,time,time,humidity)

In such cases (of multiple occurances of the same type - such as the high and low temperatures above), it can be hard to remember which slot refers to what, so the syntax allows for the use of labels as follows:

    relation forecast(latitude,longitude,date,temperatureF:high,temperatureF:low,sky,time:sunrise,time:sunset,humidity)

Labels are separated by colons and must follow the semantic type. Since the labels do not affect the semantics of the relation declaration, they are ignored by the system.

Note that there are no built in predicates in the system, so relations like the sum and product may need to be added to the problem specification. E.g.:

    relation sum(price,price,price)


4.3 Comparison Predicates:
----------------------------

Comparison predicates (like "less-than") are declared in a similar way to relations. Here are some examples:

    comparison <($distanceMi,$distanceMi)
    comparison >=($price,$price)
    comparison <($timestamp,$timestamp)

Unlike relations, their meaning is understood (interpreted automatically) by the system. Thus they are also treated like source predicates in the sense that they are used directly to generate definitions during the learning process.


4.4 Known Sources:
--------------------

Once the relations and comparison predicates have been defined, we can use them to write source definitions for a set of known sources. (These sources will be accessed by the system whenever it needs to check the validity of a new definition for the target predicate.) An example source declaration for a source called "GetZipcode" is shown below:

    source GetZipcode($city,$state,zip) :- municipality(city,state,zip,_). {wrappers.Ragnarok; getZipcode}

The variables "city" and "state" are prefixed with the "$"-symbol to distinguish them as input attributes, ("zip" is the only output attribute). The relations (predicates) appearing in the body of the rule (after the ":-"-symbol) must have already been defined in the problem specification. All head variables (input/output attributes) must appear in the body of the clause (rule). The system will work out the semantic types of the input/output attributes using the definitions of the relations in the body.  The underscore character ("_") represents a fresh / "don't care" variable (i.e. a variable that doesn't appear anywhere else in the clause).

The semi-colon (;) separated parameters given in the curly braces ({}) are used by the system to locate the appropriate wrapper class and operation for accessing the source (see section 5 for details).

In general source definitions can be far more complex and contain (be conjunctions of) multiple different relations, as is the case for the declaration below:

    source YahooFinance($tkr,ls,dt,tm,chg,op,mx,mn,vol) :- trade(dt,tm,tkr,ls), market(dt,tkr,cl,op,mx,mn,vol), sum(cl,chg,ls). {wrappers.YahooFinance; GetQuote}


4.5 Functional Sources:
----------------------

Certain sources are functional in the sense that they produce exactly one output tuple for any given (possible) input tuple. Such sources are usually the result of some (user provided) calculation such as the adding of two numbers together or calculating the distance between two coordinates. By letting the system know that a source is functional we can improve the performance of source induction. (Note that functional sources must produce exactly one output tuple for ALL POSSIBLE input tuples.) Functional sources are declared in the same way as normal sources but using "function" keyword instead of "source", as shown in the declarations below:

    function ConvertKm2Mi($distKm,distMi) :- convertDist(distKm,distMi). {wrappers.Ragnarok; convertKm2Mi}
    function Add($price1,$price2,price3) :- sum(price1,price2,price3). {invocation.Local; add}


4.6 Target Predicates:
------------------------

Once all the types, relations and sources have been defined in the problem specification, the only thing left to declare is one or more target sources. The system will try to induce a definition for each of the targets listed. Here are some example target declarations:

    target CurrencySource($currency,currency,price) {wrappers.CurrencySource; getRates}
    target Autosite($make,$model,$zipcode,$distanceMi,year,color,price,mileage,distanceMi,datetime) {wrappers.Autosite; getCars}

Note that the semantic types of the input/output attributes must be listed for each target. The wrapper parameter in the curly braces are the same as for source declarations.


4.7 Import Keyword:
---------------------

In order to allow for better organization of problem specification files, there is an additional keyword "import" which allows you to import all of the declarations contained in another file:
   
    import problems/sources.txt

If a particular entity (type, relation, etc.) is declared twice (with the same name) then the system will only import the first declaration for that entity.


5. Making Wrappers:
--------------------

To use the system you will need to write wrapper classes for all the sources (both known and unknown) in the specification file. In the future we hope to automate the wrapper generating process.

Wrappers must extend the class "invocation.Wrapper", which means that they need to implement an "invoke" method:
   
    relational.Table invoke(String[] endpoint, java.util.ArrayList inputTuple);

This method will be called by EIDOS every time it invokes the wrapper. The parameters "endpoint" are the semi-colon (";") separated source invocation parameters discussed above.
I.e. for the target declaration:

    target WebContinuum($currency,$currency,$price,price) {wrappers.WebContinuum; calcExcRate}

The wrapper would be called "wrappers.WebContinuum" and the "endpoint" parameters would be:

    endpoint[0] = "wrappers.WebContinuum";
    endpoint[1] = "calcExcRate";

The second parameter of the "invoke" method is the input tuple being sent to the source. The method returns a relational table as output. If no tuples are returned by the source for a particular input then the source should return an empty table.


5.1 Local Functions:
-------------------

Certain common functions like addition and multiplication are provided by the system as a local procedure, which is a little more efficient than needing to access a remote source. Such functions are currently being provided as methods of the class "invocation.Local", e.g.:

    function Add($price1,$price2,price3) :- sum(price1,price2,price3). {invocation.Local; add}


6. Output Data:
----------------

The results of service induction are written to a database, the name of which is defined in the properties file:

    outputDbName=output

The table generated will have the same name as the problem specification file (without the ".txt" extension). Columns of the table will be as follows:
 
    timestmp, target, definition, unfolding, score, normalisedScore, candidates, totalCandidates,
	accesses, totalAccesses, time, totalTime, timeout, maxClauseLength, maxPredRepitition,
	maxVarLevel, noVarRepetition, heuristic

The newly discovered definition for each target predicate will be in the column "definition". The rest of the columns describe different search parameters and metrics (see the cited publications for a description).


7. Advanced Settings:
--------------------

The system while running generates a lot of data which it stores in the database you provided. The system will create a new database instance (schema) using the name given in the "dbproperties" file:

    cacheDbName=cache

In this new schema (called "cache" above) the system will create two tables to represent each source it accesses.

Many of the search parameters used for constraining the search space can be altered by editing the file "Tester.java" and recompiling the sources. For more information contact Mark Carman at http://bradipo.net/mark/
