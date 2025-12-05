import { setWorldConstructor, setParallelCanAssign } from "@cucumber/cucumber";
import { OurWorld } from "../utils/world";
import { ourParallelCanAssignRules } from "../utils/parallel";

setWorldConstructor(OurWorld);
setParallelCanAssign(ourParallelCanAssignRules);
