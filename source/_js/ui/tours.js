// FIXME: USE ANGULAR DIRECTIVE!
//  General Overview Tour
var general_tour = new Tour({
  name: "general_tour",
  storage: false,
  smartPlacement: false,
  animation: true,
  steps: [{
    placement: "auto bottom",
    element: "#tour_LeftNavigation",
    title: "MARIE Environment",
    content: "For a more in-depth look at the MARIE Assembly language take a look at the Resources Page."
  }, {
    placement: "auto bottom",
    element: "#tour_Editor",
    content: "This is the code editor to write instructions that will be assembled by the assembler."
  }, {
    placement: "auto bottom",
    element: "#tour_Assembly",
    content: "In the assembly panel you can assemble the program written in the editor. Assembly errors or, on a successful assembly, the assembled instructions will be displayed."
  },{
    placement: "auto bottom",
    element: "#tour_Memory",
    content: "This panel shows the machine's memory. Which gets updated on assembly, and runtime."
  },{
    placement: "auto bottom",
    element: "#tour_Machine",
    content: "The machine panel has controls for running, stepping forward, and halting an executed process, as well as and output well."
  }]
});

// Machine Panel Tour
var machine_tour = new Tour({
  name: "machine_tour",
  storage: false,
  smartPlacement: false,
  animation: true,
  steps: [{
    placement: "auto right",
    element: "#tour_MachineControls",
    content: "The control panel offers three controls; Step-Forward to advance the program control, Play to execute the program, and Halt to terminate."
  },{
    placement: "auto right",
    element: "#tour_MachineRegisters",
    content: "This table displays the value inside the machines registers during runtime. More information can be found in the student resources."
  },{
    placement: "auto right",
    element: "#tour_MachineOutput",
    content: "This well displays the value inside the output registers during runtime."
  },{
    placement: "auto right",
    element: "#tour_MachineMessages",
    content: "Here we can see messages from the CPU regarding execution."
  }]
});

// Assembly Panel Tour
var assembly_tour = new Tour({
  name: "assembly_tour",
  storage: false,
  smartPlacement: false,
  animation: true,
  steps: [{
    placement: "auto right",
    element: "#tour_AssemblyControls",
    content: "Use the refresh button to assemble any changes made to your program, and have it loaded into memory."
  },{
    placement: "auto right",
    element: "#tour_AssemblyErrors",
    content: "Errors will displayed sequentially in a list with a description and line number."
  },{
    placement: "auto right",
    element: "#tour_Assembly",
    content: "This list shows the compiled instructions. During runtime the current instruction being executed will be highlighted."
  }]
});
