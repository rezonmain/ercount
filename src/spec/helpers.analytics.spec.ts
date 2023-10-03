import { Helpers } from "@/services/Helpers";
import { describe, test, expect } from "bun:test";

describe("Helpers.analytics", () => {
  test("getDistribution", () => {
    const ratios = [
      0.06288601909039865, 0.04267265581134194, 0.0381807973048849,
      0.0364963503649635, 0.031443009545199324, 0.02807411566535654,
      0.02695115103874228, 0.024705221785513758, 0.023582257158899493,
      0.023020774845592364,
    ];

    const result = [
      0.062886, 0.105559, 0.143739, 0.180236, 0.211679, 0.239753, 0.266704,
      0.291409, 0.314992, 0.338012,
    ];
    expect(Helpers.analytics.getDistribution(ratios)).toEqual(result);
  });
});
