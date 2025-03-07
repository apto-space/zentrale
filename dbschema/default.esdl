using extension pgvector;

module default {
    # using qualified names to prevent confusion / create 'typing'

    scalar type voyage_embedding extending ext::pgvector::vector<1024>;

    type Document extending Timestamped {
        required content: str;
        required embedding: voyage_embedding;
        required metadata: json;
    }

    type Conversation extending Timestamped {
        required conversation_anon_user_id: str;
        # messages split up in case conversations get very long
        required conversation_messages:= assert_exists(.<message_conversation[is Message]);
        required conversation_message_count:= count(.conversation_messages);
        required conversation_id: uuid {constraint exclusive};
        optional conversation_title: str;
    }

    type Message extending Timestamped {
        required message_conversation: Conversation {on target delete delete source};
        required message_content: str;
        required message_role: str;
        required message_parts: array<json>;
        required message_tool_invocations: array<json>;
        constraint exclusive on ((.message_conversation, .created_at));
        message_feedback:= assert_single(.<message[is MessageFeedback]);
    }

    type MessageFeedback extending Timestamped {
        required message: Message {on target delete delete source};
        required is_positive: bool;
        optional feedback_text: str;
        constraint exclusive on (.message);
    }

    abstract type Timestamped {
      required created_at: datetime {
        default := datetime_of_statement();
      }
      updated_at: datetime {
        default := datetime_of_statement();
        rewrite insert, update using (datetime_of_statement())
      }
    }

}
