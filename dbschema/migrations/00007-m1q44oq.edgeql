CREATE MIGRATION m1q44oqdqrshvw5dlreur6zgx6x4lnrek47s6pt73a7kkz65rem4la
    ONTO m12fhr4lacxfncl3kmkwp3ghs7pd5ppxb64vpnjqanppk4k2lpl6ea
{
  ALTER TYPE default::Message {
      CREATE REQUIRED PROPERTY message_parts: array<std::json> {
          SET REQUIRED USING (<array<std::json>>[]);
      };
      CREATE REQUIRED PROPERTY message_tool_invocations: array<std::json> {
          SET REQUIRED USING (<array<std::json>>[]);
      };
  };
};
