PROGRAM = distributionalValue
LIB0 = distributions

TSC 		= tsc
NODE		= node
RM		= rm

CONFIG		= tsconfig.json
OPTFLAGS	= 
INCLUDES	= 
CFLAGS		= 

all: $(PROGRAM)

$(PROGRAM):
	$(TSC) -p $(CONFIG) $(CFLAGS) $(OPTFLAGS) $(INCLUDES)

run:
	$(NODE) $(PROGRAM).js

clean:
	$(RM) *.js *.map
