import { setWorldConstructor, setParallelCanAssign } from "@cucumber/cucumber";
import { OurWorld } from "../utils/world.js";
import { ourParallelCanAssignRules } from "../utils/parallel.js";

setWorldConstructor(OurWorld);
setParallelCanAssign(ourParallelCanAssignRules);
