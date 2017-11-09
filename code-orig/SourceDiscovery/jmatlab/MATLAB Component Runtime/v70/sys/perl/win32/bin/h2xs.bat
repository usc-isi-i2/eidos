@rem = '--*-Perl-*--
@echo off
if "%OS%" == "Windows_NT" goto WinNT
perl -x -S "%0" %1 %2 %3 %4 %5 %6 %7 %8 %9
goto endofperl
:WinNT
perl -x -S "%0" %*
if NOT "%COMSPEC%" == "%SystemRoot%\system32\cmd.exe" goto endofperl
if %errorlevel% == 9009 echo You do not have Perl in your PATH.
goto endofperl
@rem ';
#!perl
#line 14
    eval 'exec P:\Apps\ActivePerl\temp\bin\MSWin32-x86-object\perl.exe -S $0 ${1+"$@"}'
	if $running_under_some_shell;

=head1 NAME

h2xs - convert .h C header files to Perl extensions

=head1 SYNOPSIS

B<h2xs> [B<-AOPXcdf>] [B<-v> version] [B<-n> module_name] [B<-p> prefix] [B<-s> sub] [headerfile ... [extra_libraries]]

B<h2xs> B<-h>

=head1 DESCRIPTION

I<h2xs> builds a Perl extension from C header files.  The extension
will include functions which can be used to retrieve the value of any
#define statement which was in the C header files.

The I<module_name> will be used for the name of the extension.  If
module_name is not supplied then the name of the first header file
will be used, with the first character capitalized.

If the extension might need extra libraries, they should be included
here.  The extension Makefile.PL will take care of checking whether
the libraries actually exist and how they should be loaded.
The extra libraries should be specified in the form -lm -lposix, etc,
just as on the cc command line.  By default, the Makefile.PL will
search through the library path determined by Configure.  That path
can be augmented by including arguments of the form B<-L/another/library/path>
in the extra-libraries argument.

=head1 OPTIONS

=over 5

=item B<-A>

Omit all autoload facilities.  This is the same as B<-c> but also removes the
S<C<require AutoLoader>> statement from the .pm file.

=item B<-F>

Additional flags to specify to C preprocessor when scanning header for
function declarations. Should not be used without B<-x>.

=item B<-O>

Allows a pre-existing extension directory to be overwritten.

=item B<-P>

Omit the autogenerated stub POD section. 

=item B<-X>

Omit the XS portion.  Used to generate templates for a module which is not
XS-based.

=item B<-c>

Omit C<constant()> from the .xs file and corresponding specialised
C<AUTOLOAD> from the .pm file.

=item B<-d>

Turn on debugging messages.

=item B<-f>

Allows an extension to be created for a header even if that header is
not found in /usr/include.

=item B<-h>

Print the usage, help and version for this h2xs and exit.

=item B<-n> I<module_name>

Specifies a name to be used for the extension, e.g., S<-n RPC::DCE>

=item B<-p> I<prefix>

Specify a prefix which should be removed from the Perl function names, e.g., S<-p sec_rgy_> 
This sets up the XS B<PREFIX> keyword and removes the prefix from functions that are
autoloaded via the C<constant()> mechansim.

=item B<-s> I<sub1,sub2>

Create a perl subroutine for the specified macros rather than autoload with the constant() subroutine.
These macros are assumed to have a return type of B<char *>, e.g., S<-s sec_rgy_wildcard_name,sec_rgy_wildcard_sid>.

=item B<-v> I<version>

Specify a version number for this extension.  This version number is added
to the templates.  The default is 0.01.

=item B<-x>

Automatically generate XSUBs basing on function declarations in the
header file.  The package C<C::Scan> should be installed. If this
option is specified, the name of the header file may look like
C<NAME1,NAME2>. In this case NAME1 is used instead of the specified string,
but XSUBs are emitted only for the declarations included from file NAME2.

Note that some types of arguments/return-values for functions may
result in XSUB-declarations/typemap-entries which need
hand-editing. Such may be objects which cannot be converted from/to a
pointer (like C<long long>), pointers to functions, or arrays.

=back

=head1 EXAMPLES


	# Default behavior, extension is Rusers
	h2xs rpcsvc/rusers

	# Same, but extension is RUSERS
	h2xs -n RUSERS rpcsvc/rusers

	# Extension is rpcsvc::rusers. Still finds <rpcsvc/rusers.h>
	h2xs rpcsvc::rusers

	# Extension is ONC::RPC.  Still finds <rpcsvc/rusers.h>
	h2xs -n ONC::RPC rpcsvc/rusers

	# Without constant() or AUTOLOAD
	h2xs -c rpcsvc/rusers

	# Creates templates for an extension named RPC
	h2xs -cfn RPC

	# Extension is ONC::RPC.
	h2xs -cfn ONC::RPC

	# Makefile.PL will look for library -lrpc in 
	# additional directory /opt/net/lib
	h2xs rpcsvc/rusers -L/opt/net/lib -lrpc

        # Extension is DCE::rgynbase
        # prefix "sec_rgy_" is dropped from perl function names
        h2xs -n DCE::rgynbase -p sec_rgy_ dce/rgynbase

        # Extension is DCE::rgynbase
        # prefix "sec_rgy_" is dropped from perl function names
        # subroutines are created for sec_rgy_wildcard_name and sec_rgy_wildcard_sid
        h2xs -n DCE::rgynbase -p sec_rgy_ \
        -s sec_rgy_wildcard_name,sec_rgy_wildcard_sid dce/rgynbase

	# Make XS without defines in perl.h, but with function declarations
	# visible from perl.h. Name of the extension is perl1.
	# When scanning perl.h, define -DEXT=extern -DdEXT= -DINIT(x)=
	# Extra backslashes below because the string is passed to shell.
	# Note that a directory with perl header files would 
	#  be added automatically to include path.
	h2xs -xAn perl1 -F "-DEXT=extern -DdEXT= -DINIT\(x\)=" perl.h

	# Same with function declaration in proto.h as visible from perl.h.
	h2xs -xAn perl2 perl.h,proto.h

=head1 ENVIRONMENT

No environment variables are used.

=head1 AUTHOR

Larry Wall and others

=head1 SEE ALSO

L<perl>, L<perlxstut>, L<ExtUtils::MakeMaker>, and L<AutoLoader>.

=head1 DIAGNOSTICS

The usual warnings if it cannot read or write the files involved.

=cut

my( $H2XS_VERSION ) = ' $Revision: 1.19 $ ' =~ /\$Revision:\s+([^\s]+)/;
my $TEMPLATE_VERSION = '0.01';

use Getopt::Std;

sub usage{
	warn "@_\n" if @_;
    die "h2xs [-AOPXcdfh] [-v version] [-n module_name] [-p prefix] [-s subs] [headerfile [extra_libraries]]
version: $H2XS_VERSION
    -A   Omit all autoloading facilities (implies -c).
    -F   Additional flags for C preprocessor (used with -x).
    -O   Allow overwriting of a pre-existing extension directory.
    -P   Omit the stub POD section.
    -X   Omit the XS portion.
    -c   Omit the constant() function and specialised AUTOLOAD from the XS file.
    -d   Turn on debugging messages.
    -f   Force creation of the extension even if the C header does not exist.
    -h   Display this help message
    -n   Specify a name to use for the extension (recommended).
    -p   Specify a prefix which should be removed from the Perl function names.
    -s   Create subroutines for specified macros.
    -v   Specify a version number for this extension.
    -x   Autogenerate XSUBs using C::Scan.
extra_libraries
         are any libraries that might be needed for loading the
         extension, e.g. -lm would try to link in the math library.
";
}


getopts("AF:OPXcdfhn:p:s:v:x") || usage;

usage if $opt_h;

if( $opt_v ){
	$TEMPLATE_VERSION = $opt_v;
}
$opt_c = 1 if $opt_A;
%const_xsub = map { $_,1 } split(/,+/, $opt_s) if $opt_s;

while (my $arg = shift) {
    if ($arg =~ /^-l/i) {
        $extralibs = "$arg @ARGV";
        last;
    }
    push(@path_h, $arg);
}

usage "Must supply header file or module name\n"
        unless (@path_h or $opt_n);


if( @path_h ){
    foreach my $path_h (@path_h) {
        $name ||= $path_h;
    if( $path_h =~ s#::#/#g && $opt_n ){
	warn "Nesting of headerfile ignored with -n\n";
    }
    $path_h .= ".h" unless $path_h =~ /\.h$/;
    $fullpath = $path_h;
    $path_h =~ s/,.*$// if $opt_x;
    if ($^O eq 'VMS') {  # Consider overrides of default location
	if ($path_h !~ m![:>\[]!) {
	    my($hadsys) = ($path_h =~ s!^sys/!!i);
	    if ($ENV{'DECC$System_Include'})     { $path_h = "DECC\$System_Include:$path_h";    }
	    elsif ($ENV{'DECC$Library_Include'}) { $path_h = "DECC\$Library_Include:$path_h";   }
	    elsif ($ENV{'GNU_CC_Include'})       { $path_h = 'GNU_CC_Include:' .
	                                            ($hadsys ? '[vms]' : '[000000]') . $path_h; }
	    elsif ($ENV{'VAXC$Include'})         { $path_h = "VAXC\$_Include:$path_h";          }
	    else                                 { $path_h = "Sys\$Library:$path_h";            }
	}
    }
    elsif ($^O eq 'os2') {
	$path_h = "/usr/include/$path_h" 
	  if $path_h !~ m#^([a-z]:)?[./]#i and -r "/usr/include/$path_h"; 
    }
    else { 
      $path_h = "/usr/include/$path_h" 
	if $path_h !~ m#^[./]# and -r "/usr/include/$path_h"; 
    }

    if (!$opt_c) {
      die "Can't find $path_h\n" if ( ! $opt_f && ! -f $path_h );
      # Scan the header file (we should deal with nested header files)
      # Record the names of simple #define constants into const_names
            # Function prototypes are processed below.
      open(CH, "<$path_h") || die "Can't open $path_h: $!\n";
      while (<CH>) {
	if (/^#[ \t]*define\s+([\$\w]+)\b\s*[^("]/) {
	    print "Matched $_ ($1)\n" if $opt_d;
	    $_ = $1;
	    next if /^_.*_h_*$/i; # special case, but for what?
	    if (defined $opt_p) {
	      if (!/^$opt_p(\d)/) {
		++$prefix{$_} if s/^$opt_p//;
	      }
	      else {
		warn "can't remove $opt_p prefix from '$_'!\n";
	      }
	    }
	    $const_names{$_}++;
	  }
      }
      close(CH);
    }
    }
    @const_names = sort keys %const_names;
}


$module = $opt_n || do {
	$name =~ s/\.h$//;
	if( $name !~ /::/ ){
		$name =~ s#^.*/##;
		$name = "\u$name";
	}
	$name;
};

(chdir 'ext', $ext = 'ext/') if -d 'ext';

if( $module =~ /::/ ){
	$nested = 1;
	@modparts = split(/::/,$module);
	$modfname = $modparts[-1];
	$modpname = join('/',@modparts);
}
else {
	$nested = 0;
	@modparts = ();
	$modfname = $modpname = $module;
}


if ($opt_O) {
	warn "Overwriting existing $ext$modpname!!!\n" if -e $modpname;
} else {
	die "Won't overwrite existing $ext$modpname\n" if -e $modpname;
}
if( $nested ){
	$modpath = "";
	foreach (@modparts){
		mkdir("$modpath$_", 0777);
		$modpath .= "$_/";
	}
}
mkdir($modpname, 0777);
chdir($modpname) || die "Can't chdir $ext$modpname: $!\n";

my %types_seen;
my %std_types;
my $fdecls;
my $fdecls_parsed;

if( ! $opt_X ){  # use XS, unless it was disabled
  open(XS, ">$modfname.xs") || die "Can't create $ext$modpname/$modfname.xs: $!\n";
  if ($opt_x) {
    require C::Scan;		# Run-time directive
    require Config;		# Run-time directive
    warn "Scanning typemaps...\n";
    get_typemap();
    my $c;
    my $filter;
        my @fdecls;
        foreach my $filename (@path_h) {
    my $addflags = $opt_F || '';
    if ($fullpath =~ /,/) {
      $filename = $`;
      $filter = $';
    }
    warn "Scanning $filename for functions...\n";
    $c = new C::Scan 'filename' => $filename, 'filename_filter' => $filter,
    'add_cppflags' => $addflags;
    $c->set('includeDirs' => ["$Config::Config{archlib}/CORE"]);
    
    $fdecls_parsed = $c->get('parsed_fdecls');
            push(@fdecls, @{$c->get('fdecls')});
        }
        $fdecls = [ @fdecls ];
  }
}

open(PM, ">$modfname.pm") || die "Can't create $ext$modpname/$modfname.pm: $!\n";

$" = "\n\t";
warn "Writing $ext$modpname/$modfname.pm\n";

print PM <<"END";
package $module;

use strict;
END

if( $opt_X || $opt_c || $opt_A ){
	# we won't have our own AUTOLOAD(), so won't have $AUTOLOAD
	print PM <<'END';
use vars qw($VERSION @ISA @EXPORT @EXPORT_OK);
END
}
else{
	# we'll have an AUTOLOAD(), and it will have $AUTOLOAD and
	# will want Carp.
	print PM <<'END';
use Carp;
use vars qw($VERSION @ISA @EXPORT @EXPORT_OK $AUTOLOAD);
END
}

print PM <<'END';

require Exporter;
END

print PM <<"END" if ! $opt_X;  # use DynaLoader, unless XS was disabled
require DynaLoader;
END

# require autoloader if XS is disabled.
# if XS is enabled, require autoloader unless autoloading is disabled.
if( ($opt_X && (! $opt_A)) || (!$opt_X) ) {
	print PM <<"END";
require AutoLoader;
END
}

if( $opt_X || ($opt_c && ! $opt_A) ){
	# we won't have our own AUTOLOAD(), so we'll inherit it.
	if( ! $opt_X ) { # use DynaLoader, unless XS was disabled
		print PM <<"END";

\@ISA = qw(Exporter AutoLoader DynaLoader);
END
	}
	else{
		print PM <<"END";

\@ISA = qw(Exporter AutoLoader);
END
	}
}
else{
	# 1) we have our own AUTOLOAD(), so don't need to inherit it.
	# or
	# 2) we don't want autoloading mentioned.
	if( ! $opt_X ){ # use DynaLoader, unless XS was disabled
		print PM <<"END";

\@ISA = qw(Exporter DynaLoader);
END
	}
	else{
		print PM <<"END";

\@ISA = qw(Exporter);
END
	}
}

print PM<<"END";
# Items to export into callers namespace by default. Note: do not export
# names by default without a very good reason. Use EXPORT_OK instead.
# Do not simply export all your public functions/methods/constants.
\@EXPORT = qw(
	@const_names
);
\$VERSION = '$TEMPLATE_VERSION';

END

print PM <<"END" unless $opt_c or $opt_X;
sub AUTOLOAD {
    # This AUTOLOAD is used to 'autoload' constants from the constant()
    # XS function.  If a constant is not found then control is passed
    # to the AUTOLOAD in AutoLoader.

    my \$constname;
    (\$constname = \$AUTOLOAD) =~ s/.*:://;
    croak "&$module::constant not defined" if \$constname eq 'constant';
    my \$val = constant(\$constname, \@_ ? \$_[0] : 0);
    if (\$! != 0) {
	if (\$! =~ /Invalid/) {
	    \$AutoLoader::AUTOLOAD = \$AUTOLOAD;
	    goto &AutoLoader::AUTOLOAD;
	}
	else {
		croak "Your vendor has not defined $module macro \$constname";
	}
    }
    no strict 'refs';
    *\$AUTOLOAD = sub () { \$val };
    goto &\$AUTOLOAD;
}

END

if( ! $opt_X ){ # print bootstrap, unless XS is disabled
	print PM <<"END";
bootstrap $module \$VERSION;
END
}

if( $opt_P ){ # if POD is disabled
	$after = '__END__';
}
else {
	$after = '=cut';
}

print PM <<"END";

# Preloaded methods go here.

# Autoload methods go after $after, and are processed by the autosplit program.

1;
__END__
END

$author = "A. U. Thor";
$email = 'a.u.thor@a.galaxy.far.far.away';

my $const_doc = '';
my $fdecl_doc = '';
if (@const_names and not $opt_P) {
  $const_doc = <<EOD;
\n=head1 Exported constants

  @{[join "\n  ", @const_names]}

EOD
}
if (defined $fdecls and @$fdecls and not $opt_P) {
  $fdecl_doc = <<EOD;
\n=head1 Exported functions

  @{[join "\n  ", @$fdecls]}

EOD
}

$pod = <<"END" unless $opt_P;
## Below is the stub of documentation for your module. You better edit it!
#
#=head1 NAME
#
#$module - Perl extension for blah blah blah
#
#=head1 SYNOPSIS
#
#  use $module;
#  blah blah blah
#
#=head1 DESCRIPTION
#
#Stub documentation for $module was created by h2xs. It looks like the
#author of the extension was negligent enough to leave the stub
#unedited.
#
#Blah blah blah.
#$const_doc$fdecl_doc
#=head1 AUTHOR
#
#$author, $email
#
#=head1 SEE ALSO
#
#perl(1).
#
#=cut
END

$pod =~ s/^\#//gm unless $opt_P;
print PM $pod unless $opt_P;

close PM;


if( ! $opt_X ){ # print XS, unless it is disabled
warn "Writing $ext$modpname/$modfname.xs\n";

print XS <<"END";
#include "EXTERN.h"
#include "perl.h"
#include "XSUB.h"

END
if( @path_h ){
    foreach my $path_h (@path_h) {
	my($h) = $path_h;
	$h =~ s#^/usr/include/##;
	if ($^O eq 'VMS') { $h =~ s#.*vms\]#sys/# or $h =~ s#.*[:>\]]##; }
        print XS qq{#include <$h>\n};
    }
    print XS "\n";
}

if( ! $opt_c ){
print XS <<"END";
static int
not_here(char *s)
{
    croak("$module::%s not implemented on this architecture", s);
    return -1;
}

static double
constant(char *name, int arg)
{
    errno = 0;
    switch (*name) {
END

my(@AZ, @az, @under);

foreach(@const_names){
    @AZ = 'A' .. 'Z' if !@AZ && /^[A-Z]/;
    @az = 'a' .. 'z' if !@az && /^[a-z]/;
    @under = '_'  if !@under && /^_/;
}

foreach $letter (@AZ, @az, @under) {

    last if $letter eq 'a' && !@const_names;

    print XS "    case '$letter':\n";
    my($name);
    while (substr($const_names[0],0,1) eq $letter) {
	$name = shift(@const_names);
	$macro = $prefix{$name} ? "$opt_p$name" : $name;
	next if $const_xsub{$macro};
	print XS <<"END";
	if (strEQ(name, "$name"))
#ifdef $macro
	    return $macro;
#else
	    goto not_there;
#endif
END
    }
    print XS <<"END";
	break;
END
}
print XS <<"END";
    }
    errno = EINVAL;
    return 0;

not_there:
    errno = ENOENT;
    return 0;
}

END
}

$prefix = "PREFIX = $opt_p" if defined $opt_p;
# Now switch from C to XS by issuing the first MODULE declaration:
print XS <<"END";

MODULE = $module		PACKAGE = $module		$prefix

END

foreach (sort keys %const_xsub) {
    print XS <<"END";
char *
$_()

    CODE:
#ifdef $_
    RETVAL = $_;
#else
    croak("Your vendor has not defined the $module macro $_");
#endif

    OUTPUT:
    RETVAL

END
}

# If a constant() function was written then output a corresponding
# XS declaration:
print XS <<"END" unless $opt_c;

double
constant(name,arg)
	char *		name
	int		arg

END

my %seen_decl;


sub print_decl {
  my $fh = shift;
  my $decl = shift;
  my ($type, $name, $args) = @$decl;
  return if $seen_decl{$name}++; # Need to do the same for docs as well?

  my @argnames = map {$_->[1]} @$args;
  my @argtypes = map { normalize_type( $_->[0] ) } @$args;
  my @argarrays = map { $_->[4] || '' } @$args;
  my $numargs = @$args;
  if ($numargs and $argtypes[-1] eq '...') {
    $numargs--;
    $argnames[-1] = '...';
  }
  local $" = ', ';
  $type = normalize_type($type);
  
  print $fh <<"EOP";

$type
$name(@argnames)
EOP

  for $arg (0 .. $numargs - 1) {
    print $fh <<"EOP";
	$argtypes[$arg]	$argnames[$arg]$argarrays[$arg]
EOP
  }
}

# Should be called before any actual call to normalize_type().
sub get_typemap {
  # We do not want to read ./typemap by obvios reasons.
  my @tm =  qw(../../../typemap ../../typemap ../typemap);
  my $stdtypemap =  "$Config::Config{privlib}/ExtUtils/typemap";
  unshift @tm, $stdtypemap;
  my $proto_re = "[" . quotemeta('\$%&*@;') . "]" ;
  my $image;
  
  foreach $typemap (@tm) {
    next unless -e $typemap ;
    # skip directories, binary files etc.
    warn " Scanning $typemap\n";
    warn("Warning: ignoring non-text typemap file '$typemap'\n"), next 
      unless -T $typemap ;
    open(TYPEMAP, $typemap) 
      or warn ("Warning: could not open typemap file '$typemap': $!\n"), next;
    my $mode = 'Typemap';
    while (<TYPEMAP>) {
      next if /^\s*\#/;
      if (/^INPUT\s*$/)   { $mode = 'Input'; next; }
      elsif (/^OUTPUT\s*$/)  { $mode = 'Output'; next; }
      elsif (/^TYPEMAP\s*$/) { $mode = 'Typemap'; next; }
      elsif ($mode eq 'Typemap') {
	next if /^\s*($|\#)/ ;
	if ( ($type, $image) = 
	     /^\s*(.*?\S)\s+(\S+)\s*($proto_re*)\s*$/o
	     # This may reference undefined functions:
	     and not ($image eq 'T_PACKED' and $typemap eq $stdtypemap)) {
	  normalize_type($type);
	}
      }
    }
    close(TYPEMAP) or die "Cannot close $typemap: $!";
  }
  %std_types = %types_seen;
  %types_seen = ();
}


sub normalize_type {
  my $ignore_mods = '(?:\b(?:__const__|static|inline|__inline__)\b\s*)*';
  my $type = shift;
  $type =~ s/$ignore_mods//go;
  $type =~ s/([\]\[()])/ \1 /g;
  $type =~ s/\s+/ /g;
  $type =~ s/\s+$//;
  $type =~ s/^\s+//;
  $type =~ s/\b\*/ */g;
  $type =~ s/\*\b/* /g;
  $type =~ s/\*\s+(?=\*)/*/g;
  $types_seen{$type}++ 
    unless $type eq '...' or $type eq 'void' or $std_types{$type};
  $type;
}

if ($opt_x) {
    for $decl (@$fdecls_parsed) { print_decl(\*XS, $decl) }
}

close XS;

if (%types_seen) {
  my $type;
  warn "Writing $ext$modpname/typemap\n";
  open TM, ">typemap" or die "Cannot open typemap file for write: $!";

  for $type (keys %types_seen) {
    print TM $type, "\t" x (6 - int((length $type)/8)), "T_PTROBJ\n"
  }

  close TM or die "Cannot close typemap file for write: $!";
}

} # if( ! $opt_X )

warn "Writing $ext$modpname/Makefile.PL\n";
open(PL, ">Makefile.PL") || die "Can't create $ext$modpname/Makefile.PL: $!\n";

print PL <<'END';
use ExtUtils::MakeMaker;
# See lib/ExtUtils/MakeMaker.pm for details of how to influence
# the contents of the Makefile that is written.
END
print PL "WriteMakefile(\n";
print PL "    'NAME'	=> '$module',\n";
print PL "    'VERSION_FROM' => '$modfname.pm', # finds \$VERSION\n"; 
if( ! $opt_X ){ # print C stuff, unless XS is disabled
  print PL "    'LIBS'	=> ['$extralibs'],   # e.g., '-lm' \n";
  print PL "    'DEFINE'	=> '',     # e.g., '-DHAVE_SOMETHING' \n";
  print PL "    'INC'	=> '',     # e.g., '-I/usr/include/other' \n";
}
print PL ");\n";
close(PL) || die "Can't close $ext$modpname/Makefile.PL: $!\n";

warn "Writing $ext$modpname/test.pl\n";
open(EX, ">test.pl") || die "Can't create $ext$modpname/test.pl: $!\n";
print EX <<'_END_';
# Before `make install' is performed this script should be runnable with
# `make test'. After `make install' it should work as `perl test.pl'

######################### We start with some black magic to print on failure.

# Change 1..1 below to 1..last_test_to_print .
# (It may become useful if the test is moved to ./t subdirectory.)

BEGIN { $| = 1; print "1..1\n"; }
END {print "not ok 1\n" unless $loaded;}
_END_
print EX <<_END_;
use $module;
_END_
print EX <<'_END_';
$loaded = 1;
print "ok 1\n";

######################### End of black magic.

# Insert your test code below (better if it prints "ok 13"
# (correspondingly "not ok 13") depending on the success of chunk 13
# of the test code):

_END_
close(EX) || die "Can't close $ext$modpname/test.pl: $!\n";

warn "Writing $ext$modpname/Changes\n";
open(EX, ">Changes") || die "Can't create $ext$modpname/Changes: $!\n";
print EX "Revision history for Perl extension $module.\n\n";
print EX "$TEMPLATE_VERSION  ",scalar localtime,"\n";
print EX "\t- original version; created by h2xs $H2XS_VERSION\n\n";
close(EX) || die "Can't close $ext$modpname/Changes: $!\n";

warn "Writing $ext$modpname/MANIFEST\n";
open(MANI,'>MANIFEST') or die "Can't create MANIFEST: $!";
@files = <*>;
if (!@files) {
  eval {opendir(D,'.');};
  unless ($@) { @files = readdir(D); closedir(D); }
}
if (!@files) { @files = map {chomp && $_} `ls`; }
if ($^O eq 'VMS') {
  foreach (@files) {
    # Clip trailing '.' for portability -- non-VMS OSs don't expect it
    s%\.$%%;
    # Fix up for case-sensitive file systems
    s/$modfname/$modfname/i && next;
    $_ = "\U$_" if $_ eq 'manifest' or $_ eq 'changes';
    $_ = 'Makefile.PL' if $_ eq 'makefile.pl';
  }
}
print MANI join("\n",@files), "\n";
close MANI;
__END__
:endofperl
