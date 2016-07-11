#!/usr/bin/perl

use Safe;
use Time::Limit '5.0';

my $sandbox = Safe->new();
my $regex = $ARGV[0];
my $text = $ARGV[1];
$text =~ s/'/\\'/g;

my ($code, $res) = $sandbox->reval("my \$res ='$text';my \$code = (\$res =~ $regex); return (\$code, \$res);");

if ($code) {
	printf $res;
} else {
	exit 5;
}
