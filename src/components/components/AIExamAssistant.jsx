import { useState, useEffect } from "react";

function AIExamAssistant({ resourceId, resourceTitle, isOpen, onClose, theme }) {
  const [activeTab, setActiveTab] = useState("revision");
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && resourceId) {
      fetchAIContent();
    }
  }, [isOpen, resourceId]);

  const fetchAIContent = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call - replace with actual endpoint
      // const res = await fetch('/api/generate-ai', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ resource_id: resourceId })
      // });
      // const data = await res.json();
      
      // Simulated response for demo
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockContent = {
        revision: {
          title: "Quick Revision Summary",
          items: [
            "• Data structures are specialized formats for organizing, processing, and storing data",
            "• Arrays provide O(1) random access but O(n) insertion/deletion",
            "• Linked lists offer O(1) insertion/deletion but no random access",
            "• Stacks follow LIFO (Last In First Out) principle",
            "• Queues follow FIFO (First In First Out) principle",
            "• Trees consist of nodes connected by edges, with one root node",
            "• Binary trees have at most two children per node",
            "• Binary Search Trees enable O(log n) search in balanced case",
            "• Graphs represent relationships between objects using vertices and edges",
            "• Hash tables provide average O(1) time complexity for insertions and lookups"
          ]
        },
        questions: {
          title: "Important Questions",
          long: [
            "1. Explain the difference between arrays and linked lists. When would you prefer one over the other?",
            "2. Describe the process of insertion, deletion, and traversal in a Binary Search Tree.",
            "3. Discuss the various graph traversal algorithms and their applications.",
            "4. Explain the working of hash functions and collision resolution techniques.",
            "5. Compare and contrast stack and queue data structures with real-world examples."
          ],
          short: [
            "1. What is the time complexity of accessing an element in an array?",
            "2. Define recursion and mention its base case.",
            "3. What is the difference between BFS and DFS?",
            "4. Explain the concept of a balanced binary tree.",
            "5. What are the advantages of a linked list over an array?"
          ]
        },
        concepts: {
          title: "Concept Map",
          sections: [
            {
              topic: "Linear Data Structures",
              subtopics: ["Arrays", "Linked Lists", "Stacks", "Queues"]
            },
            {
              topic: "Non-Linear Data Structures",
              subtopics: ["Trees", "Binary Trees", "BST", "Heaps", "Graphs"]
            },
            {
              topic: "Hashing",
              subtopics: ["Hash Functions", "Collision Resolution", "Open Addressing", "Chaining"]
            },
            {
              topic: "Algorithms",
              subtopics: ["Sorting", "Searching", "Traversal", "Recursion"]
            }
          ]
        }
      };
      
      setContent(mockContent);
    } catch (err) {
      setError("Failed to load AI content. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const tabs = [
    { id: "revision", label: "📖 Quick Revision", icon: "📖" },
    { id: "questions", label: "❓ Important Questions", icon: "❓" },
    { id: "concepts", label: "🗺️ Concept Map", icon: "🗺️" }
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()}
        style={styles.modal}
      >
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.headerLeft}>
            <span style={styles.headerIcon}>🤖</span>
            <div>
              <h2 style={styles.headerTitle}>AI Exam Assistant</h2>
              <p style={styles.headerSubtitle}>{resourceTitle}</p>
            </div>
          </div>
          <button onClick={onClose} style={styles.closeBtn}>✕</button>
        </div>

        {/* Tabs */}
        <div style={styles.tabs}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                ...styles.tab,
                background: activeTab === tab.id 
                  ? (theme?.highlight || "#4a5fff") 
                  : "transparent",
                color: activeTab === tab.id ? "white" : (theme?.text || "#1a1a4a"),
              }}
            >
              {tab.icon} {tab.label.replace(/^\S+\s/, '')}
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={styles.content}>
          {loading && (
            <div style={styles.loadingContainer}>
              <div className="spinner"></div>
              <p>Generating AI content...</p>
            </div>
          )}

          {error && (
            <div style={styles.errorContainer}>
              <p>{error}</p>
              <button 
                onClick={fetchAIContent}
                className="btn"
                style={styles.retryBtn}
              >
                Try Again
              </button>
            </div>
          )}

          {content && !loading && !error && (
            <>
              {activeTab === "revision" && (
                <div style={styles.revisionContent}>
                  <h3 style={styles.contentTitle}>{content.revision.title}</h3>
                  <ul style={styles.list}>
                    {content.revision.items.map((item, index) => (
                      <li key={index} style={styles.listItem}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {activeTab === "questions" && (
                <div style={styles.questionsContent}>
                  <h3 style={styles.contentTitle}>{content.questions.title}</h3>
                  
                  <div style={styles.questionSection}>
                    <h4 style={styles.questionType}>📝 Long Answer Questions</h4>
                    {content.questions.long.map((q, index) => (
                      <div key={index} style={styles.questionItem}>{q}</div>
                    ))}
                  </div>
                  
                  <div style={styles.questionSection}>
                    <h4 style={styles.questionType}>✏️ Short Answer Questions</h4>
                    {content.questions.short.map((q, index) => (
                      <div key={index} style={styles.questionItem}>{q}</div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "concepts" && (
                <div style={styles.conceptsContent}>
                  <h3 style={styles.contentTitle}>{content.concepts.title}</h3>
                  <div style={styles.conceptGrid}>
                    {content.concepts.sections.map((section, index) => (
                      <div key={index} style={styles.conceptCard}>
                        <h4 style={styles.conceptTopic}>{section.topic}</h4>
                        <div style={styles.subtopics}>
                          {section.subtopics.map((sub, idx) => (
                            <span key={idx} style={styles.subtopic}>{sub}</span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  modal: {
    maxWidth: "700px",
    maxHeight: "85vh",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "20px",
  },
  headerLeft: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
  },
  headerIcon: {
    fontSize: "40px",
  },
  headerTitle: {
    fontSize: "22px",
    fontWeight: "700",
    color: "#1a1a4a",
    margin: 0,
  },
  headerSubtitle: {
    fontSize: "14px",
    color: "#666",
    margin: "5px 0 0 0",
  },
  closeBtn: {
    background: "none",
    border: "none",
    fontSize: "20px",
    cursor: "pointer",
    color: "#666",
    padding: "5px 10px",
    borderRadius: "5px",
    transition: "all 0.3s ease",
  },
  tabs: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
    borderBottom: "1px solid rgba(100, 120, 255, 0.1)",
    paddingBottom: "15px",
  },
  tab: {
    padding: "10px 20px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
    transition: "all 0.3s ease",
    flex: 1,
  },
  content: {
    maxHeight: "500px",
    overflowY: "auto",
  },
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "60px 20px",
    gap: "15px",
    color: "#666",
  },
  errorContainer: {
    textAlign: "center",
    padding: "40px 20px",
    color: "#e74c3c",
  },
  retryBtn: {
    marginTop: "15px",
  },
  contentTitle: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#1a1a4a",
    marginBottom: "20px",
  },
  revisionContent: {},
  list: {
    listStyle: "none",
    padding: 0,
    margin: 0,
  },
  listItem: {
    padding: "10px 0",
    borderBottom: "1px solid rgba(100, 120, 255, 0.1)",
    fontSize: "14px",
    color: "#1a1a4a",
    lineHeight: "1.6",
  },
  questionsContent: {},
  questionSection: {
    marginBottom: "25px",
  },
  questionType: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#1a1a4a",
    marginBottom: "15px",
  },
  questionItem: {
    padding: "12px 15px",
    background: "rgba(100, 120, 255, 0.05)",
    borderRadius: "8px",
    marginBottom: "10px",
    fontSize: "14px",
    color: "#1a1a4a",
    lineHeight: "1.5",
  },
  conceptsContent: {},
  conceptGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "15px",
  },
  conceptCard: {
    padding: "15px",
    background: "rgba(100, 120, 255, 0.05)",
    borderRadius: "10px",
    border: "1px solid rgba(100, 120, 255, 0.1)",
  },
  conceptTopic: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#1a1a4a",
    marginBottom: "10px",
  },
  subtopics: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
  },
  subtopic: {
    padding: "4px 10px",
    background: "rgba(100, 120, 255, 0.1)",
    borderRadius: "15px",
    fontSize: "12px",
    color: "#1a1a4a",
  },
};

export default AIExamAssistant;

