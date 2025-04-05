// Define complex code examples for different languages
export const COMPLEX_CODE_EXAMPLES = {
  javascript: `// Complex async/await example with error handling
async function fetchUserData(userId) {
  try {
    const response = await fetch(\`https://api.example.com/users/\${userId}\`);
    
    if (!response.ok) {
      throw new Error(\`HTTP error! Status: \${response.status}\`);
    }
    
    const userData = await response.json();
    
    // Process and transform the data
    return {
      ...userData,
      fullName: \`\${userData.firstName} \${userData.lastName}\`,
      isActive: userData.status === 'active',
      lastLoginDate: userData.lastLogin ? new Date(userData.lastLogin) : null
    };
  } catch (error) {
    console.error("Error fetching user data:", error.message);
    return null;
  }
}

// Usage with async/await and promise chaining
(async () => {
  const user = await fetchUserData(123);
  
  if (user) {
    console.log(\`Found user: \${user.fullName}\`);
    
    // Process user data further
    fetchUserData(user.managerId)
      .then(manager => {
        if (manager) {
          console.log(\`User's manager: \${manager.fullName}\`);
        }
      })
      .catch(err => console.error("Manager fetch failed:", err));
  }
})();`,

  python: `# Complex data processing with classes and generators
import csv
import os
from dataclasses import dataclass
from typing import List, Optional, Generator, Iterator
from contextlib import contextmanager

@dataclass
class Student:
    id: int
    name: str
    grade: float
    courses: List[str]
    
    def is_honor_roll(self) -> bool:
        return self.grade >= 3.5
    
    def add_course(self, course: str) -> None:
        if course not in self.courses:
            self.courses.append(course)

class StudentRegistry:
    def __init__(self, data_file: str):
        self.data_file = data_file
        self.students = {}
        
    @contextmanager
    def open_data_file(self, mode='r'):
        """Context manager for file operations"""
        file = open(self.data_file, mode)
        try:
            yield file
        finally:
            file.close()
    
    def load_students(self) -> None:
        """Load students from CSV file"""
        if not os.path.exists(self.data_file):
            return
            
        with self.open_data_file() as file:
            reader = csv.reader(file)
            next(reader)  # Skip header
            
            for row in reader:
                if len(row) >= 4:
                    student_id = int(row[0])
                    name = row[1]
                    grade = float(row[2])
                    courses = row[3].split(';') if row[3] else []
                    
                    self.students[student_id] = Student(
                        id=student_id,
                        name=name,
                        grade=grade,
                        courses=courses
                    )
    
    def get_student(self, student_id: int) -> Optional[Student]:
        """Get a student by ID"""
        return self.students.get(student_id)
    
    def get_honor_roll_students(self) -> Iterator[Student]:
        """Get all students on the honor roll"""
        return (s for s in self.students.values() if s.is_honor_roll())
    
    def process_grades(self, curve: float = 0.0) -> Generator[tuple, None, None]:
        """Process grades with optional curve"""
        for student_id, student in self.students.items():
            original_grade = student.grade
            new_grade = min(4.0, original_grade + curve)
            student.grade = new_grade
            yield (student.name, original_grade, new_grade)

# Usage example
registry = StudentRegistry("students.csv")
registry.load_students()

# Find honor roll students
honor_students = list(registry.get_honor_roll_students())
print(f"Found {len(honor_students)} honor roll students")

# Apply grade curve and process results
for name, old_grade, new_grade in registry.process_grades(curve=0.3):
    print(f"Student {name}: {old_grade:.1f} → {new_grade:.1f}")

# Get a specific student
if student := registry.get_student(12345):
    print(f"Student {student.name} has a grade of {student.grade}")
    student.add_course("Computer Science")
else:
    print("Student not found")`,

  typescript: `// Advanced TypeScript generics with type-safe event system
type EventCallback<T> = (data: T) => void;

class EventEmitter<EventMap extends Record<string, any>> {
  private listeners = new Map<
    keyof EventMap, 
    Set<EventCallback<any>>
  >();

  public on<E extends keyof EventMap>(
    event: E, 
    callback: EventCallback<EventMap[E]>
  ): this {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);
    return this;
  }

  public off<E extends keyof EventMap>(
    event: E, 
    callback: EventCallback<EventMap[E]>
  ): this {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.delete(callback);
      if (callbacks.size === 0) {
        this.listeners.delete(event);
      }
    }
    return this;
  }

  public emit<E extends keyof EventMap>(
    event: E, 
    data: EventMap[E]
  ): boolean {
    const callbacks = this.listeners.get(event);
    if (!callbacks) return false;
    
    callbacks.forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error(\`Error in event \${String(event)} callback:\`, error);
      }
    });
    
    return true;
  }
}

// Application-specific events
interface AppEvents {
  'user:login': { userId: string; timestamp: number };
  'user:logout': { userId: string; timestamp: number };
  'data:update': { entityId: string; field: string; value: any };
}

// Create typed event emitter
const appEvents = new EventEmitter<AppEvents>();

// Add strongly-typed event listeners
appEvents.on('user:login', ({ userId, timestamp }) => {
  console.log(\`User \${userId} logged in at \${new Date(timestamp).toISOString()}\`);
});

appEvents.on('data:update', ({ entityId, field, value }) => {
  console.log(\`Entity \${entityId} updated: \${field} = \${value}\`);
});

// Emit events with type checking
appEvents.emit('user:login', { 
  userId: 'user123', 
  timestamp: Date.now() 
});

appEvents.emit('data:update', {
  entityId: 'entity456',
  field: 'status',
  value: 'active'
});`,

  java: `// Multithreaded file processor with Observer pattern
import java.io.*;
import java.nio.file.*;
import java.util.*;
import java.util.concurrent.*;
import java.util.function.Consumer;

// Observer interface
interface FileProcessListener {
    void onFileProcessed(File file, boolean success);
    void onProcessingComplete(int totalFiles, int successCount);
}

// Observable subject
class FileProcessor {
    private final ExecutorService executor;
    private final List<FileProcessListener> listeners = new CopyOnWriteArrayList<>();
    private final Consumer<File> fileAction;
    
    public FileProcessor(int threadCount, Consumer<File> fileAction) {
        this.executor = Executors.newFixedThreadPool(threadCount);
        this.fileAction = fileAction;
    }
    
    public void addListener(FileProcessListener listener) {
        listeners.add(listener);
    }
    
    public void removeListener(FileProcessListener listener) {
        listeners.remove(listener);
    }
    
    private void notifyFileProcessed(File file, boolean success) {
        for (FileProcessListener listener : listeners) {
            listener.onFileProcessed(file, success);
        }
    }
    
    private void notifyProcessingComplete(int totalFiles, int successCount) {
        for (FileProcessListener listener : listeners) {
            listener.onProcessingComplete(totalFiles, successCount);
        }
    }
    
    public CompletableFuture<ProcessingSummary> processDirectory(Path directory, String extension) {
        CompletableFuture<ProcessingSummary> result = new CompletableFuture<>();
        
        try {
            // Find all matching files
            List<File> files = Files.walk(directory)
                .filter(Files::isRegularFile)
                .filter(p -> p.toString().endsWith(extension))
                .map(Path::toFile)
                .collect(Collectors.toList());
            
            if (files.isEmpty()) {
                result.complete(new ProcessingSummary(0, 0));
                return result;
            }
            
            final int totalFiles = files.size();
            final AtomicInteger completedCount = new AtomicInteger(0);
            final AtomicInteger successCount = new AtomicInteger(0);
            
            // Process each file in the thread pool
            for (File file : files) {
                executor.submit(() -> {
                    boolean success = false;
                    try {
                        fileAction.accept(file);
                        success = true;
                        successCount.incrementAndGet();
                    } catch (Exception e) {
                        System.err.println("Error processing file: " + file.getName());
                        e.printStackTrace();
                    } finally {
                        notifyFileProcessed(file, success);
                        
                        // Check if this was the last file
                        if (completedCount.incrementAndGet() == totalFiles) {
                            int finalSuccessCount = successCount.get();
                            notifyProcessingComplete(totalFiles, finalSuccessCount);
                            result.complete(new ProcessingSummary(totalFiles, finalSuccessCount));
                        }
                    }
                });
            }
        } catch (Exception e) {
            result.completeExceptionally(e);
        }
        
        return result;
    }
    
    public void shutdown() {
        executor.shutdown();
        try {
            if (!executor.awaitTermination(10, TimeUnit.SECONDS)) {
                executor.shutdownNow();
            }
        } catch (InterruptedException e) {
            executor.shutdownNow();
            Thread.currentThread().interrupt();
        }
    }
    
    // Result class
    public static class ProcessingSummary {
        private final int totalFiles;
        private final int successCount;
        
        public ProcessingSummary(int totalFiles, int successCount) {
            this.totalFiles = totalFiles;
            this.successCount = successCount;
        }
        
        public int getTotalFiles() { return totalFiles; }
        public int getSuccessCount() { return successCount; }
        public int getFailureCount() { return totalFiles - successCount; }
    }
}

// Example usage
public class FileProcessingDemo {
    public static void main(String[] args) {
        // Create processor with 4 threads that counts lines in each file
        FileProcessor processor = new FileProcessor(4, file -> {
            try (BufferedReader reader = new BufferedReader(new FileReader(file))) {
                long lineCount = reader.lines().count();
                System.out.println(file.getName() + ": " + lineCount + " lines");
            } catch (IOException e) {
                throw new UncheckedIOException(e);
            }
        });
        
        // Add a listener
        processor.addListener(new FileProcessListener() {
            @Override
            public void onFileProcessed(File file, boolean success) {
                System.out.println("Processed: " + file.getName() + 
                                  " - " + (success ? "Success" : "Failed"));
            }
            
            @Override
            public void onProcessingComplete(int totalFiles, int successCount) {
                System.out.println("Processing complete! " + 
                                  successCount + "/" + totalFiles + " files processed successfully");
            }
        });
        
        try {
            // Process all .txt files in the current directory
            CompletableFuture<FileProcessor.ProcessingSummary> future = 
                processor.processDirectory(Paths.get("."), ".txt");
                
            // Wait for processing to complete
            FileProcessor.ProcessingSummary summary = future.get();
            System.out.println("Summary: " + summary.getSuccessCount() + 
                              " succeeded, " + summary.getFailureCount() + " failed");
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            processor.shutdown();
        }
    }
}`,

  csharp: `// Asynchronous REST API client with dependency injection
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

// Data models
public class User {
    public int Id { get; set; }
    public string Name { get; set; }
    public string Email { get; set; }
}

public class Post {
    public int Id { get; set; }
    public int UserId { get; set; }
    public string Title { get; set; }
    public string Body { get; set; }
}

// Service interfaces
public interface IApiClient {
    Task<T> GetAsync<T>(string endpoint);
    Task<IEnumerable<T>> GetAllAsync<T>(string endpoint);
}

public interface IUserService {
    Task<User> GetUserAsync(int userId);
    Task<IEnumerable<Post>> GetUserPostsAsync(int userId);
}

// API Client implementation
public class ApiClient : IApiClient, IDisposable {
    private readonly HttpClient _httpClient;
    private readonly ILogger<ApiClient> _logger;
    private readonly JsonSerializerOptions _jsonOptions;

    public ApiClient(HttpClient httpClient, ILogger<ApiClient> logger) {
        _httpClient = httpClient;
        _logger = logger;
        _jsonOptions = new JsonSerializerOptions {
            PropertyNameCaseInsensitive = true
        };
    }

    public async Task<T> GetAsync<T>(string endpoint) {
        try {
            _logger.LogInformation($"Fetching data from {endpoint}");
            var response = await _httpClient.GetAsync(endpoint);
            response.EnsureSuccessStatusCode();
            
            var content = await response.Content.ReadAsStreamAsync();
            return await JsonSerializer.DeserializeAsync<T>(content, _jsonOptions);
        }
        catch (HttpRequestException ex) {
            _logger.LogError(ex, $"Error fetching {typeof(T).Name} from {endpoint}");
            throw;
        }
    }

    public async Task<IEnumerable<T>> GetAllAsync<T>(string endpoint) {
        try {
            _logger.LogInformation($"Fetching collection from {endpoint}");
            var response = await _httpClient.GetAsync(endpoint);
            response.EnsureSuccessStatusCode();
            
            var content = await response.Content.ReadAsStreamAsync();
            return await JsonSerializer.DeserializeAsync<IEnumerable<T>>(content, _jsonOptions);
        }
        catch (HttpRequestException ex) {
            _logger.LogError(ex, $"Error fetching {typeof(T).Name} collection from {endpoint}");
            throw;
        }
    }

    public void Dispose() {
        _httpClient?.Dispose();
    }
}

// User service implementation
public class UserService : IUserService {
    private readonly IApiClient _apiClient;
    private readonly ILogger<UserService> _logger;
    private const string BaseUrl = "https://jsonplaceholder.typicode.com";

    public UserService(IApiClient apiClient, ILogger<UserService> logger) {
        _apiClient = apiClient;
        _logger = logger;
    }

    public async Task<User> GetUserAsync(int userId) {
        _logger.LogInformation($"Getting user with ID: {userId}");
        return await _apiClient.GetAsync<User>($"{BaseUrl}/users/{userId}");
    }

    public async Task<IEnumerable<Post>> GetUserPostsAsync(int userId) {
        _logger.LogInformation($"Getting posts for user ID: {userId}");
        return await _apiClient.GetAllAsync<Post>($"{BaseUrl}/users/{userId}/posts");
    }
}

// Application entry point
class Program {
    static async Task Main(string[] args) {
        // Setup dependency injection
        var services = new ServiceCollection();
        
        // Register services
        services.AddLogging(builder => {
            builder.AddConsole();
            builder.SetMinimumLevel(LogLevel.Information);
        });
        
        services.AddHttpClient();
        services.AddSingleton<IApiClient, ApiClient>();
        services.AddScoped<IUserService, UserService>();
        
        // Build the service provider
        var serviceProvider = services.BuildServiceProvider();
        
        // Use the user service
        var userService = serviceProvider.GetRequiredService<IUserService>();
        
        try {
            // Get a user
            var user = await userService.GetUserAsync(1);
            Console.WriteLine($"User: {user.Name} ({user.Email})");
            
            // Get user's posts
            var posts = await userService.GetUserPostsAsync(1);
            Console.WriteLine($"User has {posts.Count()} posts:");
            
            foreach (var post in posts.Take(3)) {
                Console.WriteLine($"- {post.Title}");
            }
        }
        catch (Exception ex) {
            Console.WriteLine($"Error: {ex.Message}");
        }
    }
}`,

  go: `// Concurrent web crawler with rate limiting
package main

import (
	"context"
	"fmt"
	"net/http"
	"net/url"
	"strings"
	"sync"
	"time"

	"golang.org/x/net/html"
)

// Page represents a crawled web page
type Page struct {
	URL   string
	Title string
	Links []string
}

// Crawler implements a web crawler with concurrency and rate limiting
type Crawler struct {
	client         *http.Client
	visitedURLs    map[string]bool
	mutex          sync.RWMutex
	rateLimiter    <-chan time.Time
	maxDepth       int
	results        []Page
	resultsMutex   sync.Mutex
	wg             sync.WaitGroup
}

// NewCrawler creates a new web crawler instance
func NewCrawler(requestsPerSecond int, timeout time.Duration, maxDepth int) *Crawler {
	return &Crawler{
		client: &http.Client{
			Timeout: timeout,
		},
		visitedURLs: make(map[string]bool),
		rateLimiter: time.Tick(time.Second / time.Duration(requestsPerSecond)),
		maxDepth:    maxDepth,
		results:     make([]Page, 0),
	}
}

// Crawl starts crawling from a given URL
func (c *Crawler) Crawl(ctx context.Context, baseURL string) []Page {
	parsedURL, err := url.Parse(baseURL)
	if err != nil {
		fmt.Printf("Invalid URL: %s - %v\\n", baseURL, err)
		return nil
	}

	// Start crawling from the base URL
	c.crawlPage(ctx, parsedURL, 0)
	
	// Wait for all goroutines to finish
	c.wg.Wait()
	
	return c.results
}

func (c *Crawler) crawlPage(ctx context.Context, pageURL *url.URL, depth int) {
	// Increment the wait group counter
	c.wg.Add(1)
	
	// Launch a goroutine for this page
	go func() {
		// Decrement the counter when the goroutine completes
		defer c.wg.Done()
		
		// Check if we've reached max depth
		if depth > c.maxDepth {
			return
		}
		
		// Normalize URL
		normalizedURL := pageURL.String()
		
		// Check if URL has already been visited
		c.mutex.RLock()
		visited := c.visitedURLs[normalizedURL]
		c.mutex.RUnlock()
		
		if visited {
			return
		}
		
		// Mark as visited
		c.mutex.Lock()
		c.visitedURLs[normalizedURL] = true
		c.mutex.Unlock()
		
		// Apply rate limiting
		select {
		case <-c.rateLimiter:
			// Rate limit token acquired, proceed
		case <-ctx.Done():
			fmt.Println("Crawling canceled")
			return
		}
		
		// Fetch the page
		page, err := c.fetchPage(ctx, pageURL)
		if err != nil {
			fmt.Printf("Error fetching %s: %v\\n", pageURL.String(), err)
			return
		}
		
		// Store the result
		c.resultsMutex.Lock()
		c.results = append(c.results, page)
		c.resultsMutex.Unlock()
		
		fmt.Printf("[%d] Crawled: %s - %s (%d links)\\n", 
			depth, pageURL.String(), page.Title, len(page.Links))
		
		// Extract and follow links if we haven't reached max depth
		if depth < c.maxDepth {
			for _, link := range page.Links {
				linkURL, err := url.Parse(link)
				if err != nil {
					continue
				}
				
				// Handle relative URLs
				if !linkURL.IsAbs() {
					linkURL = pageURL.ResolveReference(linkURL)
				}
				
				// Only follow links to the same host
				if linkURL.Host == pageURL.Host {
					// Crawl the linked page
					c.crawlPage(ctx, linkURL, depth+1)
				}
			}
		}
	}()
}

func (c *Crawler) fetchPage(ctx context.Context, pageURL *url.URL) (Page, error) {
	// Create a new request with context
	req, err := http.NewRequestWithContext(ctx, "GET", pageURL.String(), nil)
	if err != nil {
		return Page{}, err
	}
	
	// Set user agent
	req.Header.Set("User-Agent", "GolangWebCrawler/1.0")
	
	// Send the request
	resp, err := c.client.Do(req)
	if err != nil {
		return Page{}, err
	}
	defer resp.Body.Close()
	
	// Check response status
	if resp.StatusCode != http.StatusOK {
		return Page{}, fmt.Errorf("HTTP status %d", resp.StatusCode)
	}
	
	// Parse HTML
	doc, err := html.Parse(resp.Body)
	if err != nil {
		return Page{}, err
	}
	
	// Extract page info
	page := Page{
		URL:   pageURL.String(),
		Links: make([]string, 0),
	}
	
	// Extract title and links
	var f func(*html.Node)
	f = func(n *html.Node) {
		if n.Type == html.ElementNode {
			// Extract title
			if n.Data == "title" && n.FirstChild != nil {
				page.Title = n.FirstChild.Data
			}
			
			// Extract links
			if n.Data == "a" {
				for _, attr := range n.Attr {
					if attr.Key == "href" {
						page.Links = append(page.Links, attr.Val)
						break
					}
				}
			}
		}
		
		// Traverse the DOM tree
		for c := n.FirstChild; c != nil; c = c.NextSibling {
			f(c)
		}
	}
	f(doc)
	
	return page, nil
}

func main() {
	// Set up crawler with rate limit of 2 requests per second, 10s timeout, max depth 2
	crawler := NewCrawler(2, 10*time.Second, 2)
	
	// Create a context with timeout
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()
	
	// Start crawling
	fmt.Println("Starting crawl...")
	startTime := time.Now()
	
	results := crawler.Crawl(ctx, "https://go.dev/")
	
	// Print summary
	duration := time.Since(startTime)
	fmt.Printf("\\nCrawl completed in %v\\n", duration)
	fmt.Printf("Pages crawled: %d\\n", len(results))
	
	// Print the first few results
	fmt.Println("\\nResults:")
	for i, page := range results {
		if i >= 5 {
			fmt.Printf("... and %d more\\n", len(results)-5)
			break
		}
		fmt.Printf("%d. %s - %s\\n", i+1, page.Title, page.URL)
	}
}`,

  swift: `// Protocol-oriented programming with generics
import Foundation

// MARK: - Protocol Definitions

protocol Identifiable {
    associatedtype ID: Hashable
    var id: ID { get }
}

protocol Storable: Identifiable, Codable {
    static var storageKey: String { get }
}

protocol Repository {
    associatedtype Entity: Storable
    
    func findAll() -> [Entity]
    func findById(_ id: Entity.ID) -> Entity?
    func save(_ entity: Entity) -> Bool
    func delete(_ id: Entity.ID) -> Bool
}

// MARK: - Extensions

extension Storable {
    static var storageKey: String {
        return String(describing: Self.self)
    }
}

// MARK: - Repository Implementation

class DiskRepository<T: Storable>: Repository {
    typealias Entity = T
    
    private let fileManager = FileManager.default
    private let encoder = JSONEncoder()
    private let decoder = JSONDecoder()
    
    init() {
        encoder.outputFormatting = .prettyPrinted
    }
    
    func findAll() -> [Entity] {
        guard let data = try? Data(contentsOf: storageURL) else {
            return []
        }
        
        do {
            return try decoder.decode([Entity].self, from: data)
        } catch {
            print("Error decoding entities: \\(error)")
            return []
        }
    }
    
    func findById(_ id: Entity.ID) -> Entity? {
        return findAll().first { $0.id == id }
    }
    
    func save(_ entity: Entity) -> Bool {
        var entities = findAll()
        
        // Update existing entity or add new one
        if let index = entities.firstIndex(where: { $0.id == entity.id }) {
            entities[index] = entity
        } else {
            entities.append(entity)
        }
        
        return saveEntities(entities)
    }
    
    func delete(_ id: Entity.ID) -> Bool {
        let entities = findAll().filter { $0.id != id }
        return saveEntities(entities)
    }
    
    private func saveEntities(_ entities: [Entity]) -> Bool {
        do {
            let data = try encoder.encode(entities)
            try data.write(to: storageURL, options: .atomicWrite)
            return true
        } catch {
            print("Error saving entities: \\(error)")
            return false
        }
    }
    
    private var storageURL: URL {
        let documentsURL = fileManager.urls(for: .documentDirectory, in: .userDomainMask)[0]
        return documentsURL.appendingPathComponent("\\(T.storageKey).json")
    }
}

// MARK: - Model Definitions

struct User: Storable {
    let id: UUID
    var username: String
    var email: String
    var lastLogin: Date?
    
    init(id: UUID = UUID(), username: String, email: String, lastLogin: Date? = nil) {
        self.id = id
        self.username = username
        self.email = email
        self.lastLogin = lastLogin
    }
}

struct Task: Storable {
    let id: UUID
    var title: String
    var description: String?
    var isComplete: Bool
    var dueDate: Date?
    var userId: UUID
    
    init(id: UUID = UUID(), title: String, description: String? = nil, 
         isComplete: Bool = false, dueDate: Date? = nil, userId: UUID) {
        self.id = id
        self.title = title
        self.description = description
        self.isComplete = isComplete
        self.dueDate = dueDate
        self.userId = userId
    }
}

// MARK: - Repository Factory

class RepositoryFactory {
    static let shared = RepositoryFactory()
    
    private init() {}
    
    lazy var userRepository: DiskRepository<User> = {
        return DiskRepository<User>()
    }()
    
    lazy var taskRepository: DiskRepository<Task> = {
        return DiskRepository<Task>()
    }()
}

// MARK: - Usage Example

// Create a service that uses the repositories
class TaskService {
    private let userRepository: DiskRepository<User>
    private let taskRepository: DiskRepository<Task>
    
    init(userRepository: DiskRepository<User> = RepositoryFactory.shared.userRepository,
         taskRepository: DiskRepository<Task> = RepositoryFactory.shared.taskRepository) {
        self.userRepository = userRepository
        self.taskRepository = taskRepository
    }
    
    func getTasksForUser(id userId: UUID) -> [Task] {
        // Check if user exists
        guard userRepository.findById(userId) != nil else {
            return []
        }
        
        // Return all tasks for this user
        return taskRepository.findAll().filter { $0.userId == userId }
    }
    
    func createTask(title: String, description: String?, dueDate: Date?, userId: UUID) -> Task? {
        // Verify user exists
        guard userRepository.findById(userId) != nil else {
            return nil
        }
        
        // Create and save new task
        let task = Task(title: title, description: description, dueDate: dueDate, userId: userId)
        
        return taskRepository.save(task) ? task : nil
    }
    
    func completeTask(id taskId: UUID) -> Bool {
        guard var task = taskRepository.findById(taskId) else {
            return false
        }
        
        task.isComplete = true
        return taskRepository.save(task)
    }
}

// Example usage
let userRepo = RepositoryFactory.shared.userRepository
let taskService = TaskService()

// Create a user
let user = User(username: "swift_dev", email: "dev@example.com")
userRepo.save(user)

// Create tasks for the user
if let task1 = taskService.createTask(
    title: "Learn Swift Protocols",
    description: "Study protocol-oriented programming concepts",
    dueDate: Date().addingTimeInterval(7 * 24 * 60 * 60),
    userId: user.id
) {
    print("Created task: \\(task1.title)")
}

if let task2 = taskService.createTask(
    title: "Build iOS App",
    description: "Apply protocols and repositories in a real app",
    dueDate: Date().addingTimeInterval(30 * 24 * 60 * 60),
    userId: user.id
) {
    print("Created task: \\(task2.title)")
    
    // Complete the task
    if taskService.completeTask(id: task2.id) {
        print("Task marked as complete!")
    }
}

// Get all tasks for user
let userTasks = taskService.getTasksForUser(id: user.id)
print("\\nUser \\(user.username) has \\(userTasks.count) tasks:")
for task in userTasks {
    let status = task.isComplete ? "✓" : "□"
    print("\\(status) \\(task.title)")
}`,

  ruby: `# Metaprogramming with Ruby DSL for configuration
require 'yaml'
require 'logger'

# Configuration DSL for application settings
class ConfigBuilder
  def initialize
    @config = {}
    @logger = Logger.new(STDOUT)
    @logger.level = Logger::INFO
  end
  
  def method_missing(method_name, *args, &block)
    if block_given?
      @config[method_name] = {}
      ConfigSection.new(@config[method_name]).instance_eval(&block)
    elsif args.size == 1
      @config[method_name] = args.first
    else
      super
    end
  end
  
  def to_hash
    @config
  end
  
  def save_to_file(filename)
    File.open(filename, 'w') do |file|
      file.write(YAML.dump(@config))
    end
    @logger.info("Configuration saved to #{filename}")
  end
  
  class ConfigSection
    def initialize(section_hash)
      @section = section_hash
    end
    
    def method_missing(method_name, *args, &block)
      if block_given?
        @section[method_name] = {}
        ConfigSection.new(@section[method_name]).instance_eval(&block)
      elsif args.size == 1
        @section[method_name] = args.first
      else
        super
      end
    end
  end
end

# Helper module to create a DSL
module Configuration
  def self.define(&block)
    builder = ConfigBuilder.new
    builder.instance_eval(&block)
    builder.to_hash
  end
  
  def self.load_from_file(filename)
    YAML.load_file(filename)
  rescue => e
    Logger.new(STDOUT).error("Error loading configuration: #{e.message}")
    {}
  end
end

# Application class using the configuration
class Application
  attr_reader :config, :name
  
  def initialize(config = {})
    @config = config
    @name = config[:app_name] || "Default App"
    @logger = Logger.new(STDOUT)
    @logger.level = config.dig(:logging, :level) || Logger::INFO
  end
  
  def database_url
    db = config[:database] || {}
    "#{db[:adapter]}://#{db[:username]}:#{db[:password]}@#{db[:host]}:#{db[:port]}/#{db[:name]}"
  end
  
  def configure_components
    components = []
    
    if config[:components]
      config[:components].each do |name, settings|
        component = Component.new(name, settings)
        components << component
        @logger.info("Configured component: #{name}")
      end
    end
    
    components
  end
  
  def start
    @logger.info("Starting application: #{name}")
    @logger.info("Database URL: #{database_url}")
    
    components = configure_components
    @logger.info("Initialized #{components.size} components")
    
    yield(self) if block_given?
    
    @logger.info("Application started successfully")
  end
  
  class Component
    attr_reader :name, :settings
    
    def initialize(name, settings = {})
      @name = name
      @settings = settings
    end
    
    def enabled?
      settings[:enabled] != false
    end
    
    def to_s
      "Component(#{name}): #{settings.inspect}"
    end
  end
end

# Example usage of the configuration DSL
config = Configuration.define do
  app_name "Ruby Metaprogramming Demo"
  version "1.0.0"
  
  database do
    adapter "postgres"
    host "localhost"
    port 5432
    name "app_database"
    username "admin"
    password "secure_password"
    pool_size 5
  end
  
  logging do
    level Logger::DEBUG
    output "app.log"
    rotation "daily"
  end
  
  components do
    authentication do
      provider "oauth2"
      enabled true
      timeout 3600
    end
    
    cache do
      provider "redis"
      host "localhost"
      port 6379
      ttl 300
    end
    
    email do
      provider "smtp"
      host "smtp.example.com"
      port 587
      username "mailer@example.com"
      password "mail_password"
      tls true
    end
  end
end

# Save configuration to a file
builder = ConfigBuilder.new
builder.instance_eval do
  app_name "Ruby Metaprogramming Demo"
  # Same configuration as above...
end
# builder.save_to_file("config.yml")

# Create and start the application
app = Application.new(config)
app.start do |application|
  puts "Application name: #{application.name}"
  puts "Using database: #{application.database_url}"
end`,

  php: `<?php
// Advanced RESTful API with middleware and database connection
namespace App\Http;

// Autoloader
spl_autoload_register(function ($class) {
    $file = str_replace('\\\\', '/', $class) . '.php';
    if (file_exists($file)) {
        require $file;
    }
});

// Request class
class Request {
    private array $params;
    private array $query;
    private array $body;
    private string $method;
    private string $uri;
    
    public function __construct() {
        $this->method = $_SERVER['REQUEST_METHOD'];
        $this->uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
        $this->params = [];
        $this->query = $_GET;
        $this->body = json_decode(file_get_contents('php://input'), true) ?? [];
    }
    
    public function getMethod(): string {
        return $this->method;
    }
    
    public function getUri(): string {
        return $this->uri;
    }
    
    public function setParams(array $params): void {
        $this->params = $params;
    }
    
    public function getParam(string $name, $default = null) {
        return $this->params[$name] ?? $default;
    }
    
    public function getQuery(string $name, $default = null) {
        return $this->query[$name] ?? $default;
    }
    
    public function getBody(): array {
        return $this->body;
    }
}

// Response class
class Response {
    public function json($data, int $statusCode = 200): void {
        http_response_code($statusCode);
        header('Content-Type: application/json');
        echo json_encode($data);
        exit;
    }
    
    public function status(int $statusCode): self {
        http_response_code($statusCode);
        return $this;
    }
    
    public function notFound(string $message = 'Not Found'): void {
        $this->json(['error' => $message], 404);
    }
    
    public function badRequest(string $message = 'Bad Request'): void {
        $this->json(['error' => $message], 400);
    }
}

// Middleware interface
interface Middleware {
    public function handle(Request $request, Response $response, callable $next);
}

// Authentication middleware
class AuthMiddleware implements Middleware {
    public function handle(Request $request, Response $response, callable $next) {
        $authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
        
        if (empty($authHeader) || !str_starts_with($authHeader, 'Bearer ')) {
            return $response->json(['error' => 'Unauthorized'], 401);
        }
        
        $token = substr($authHeader, 7);
        
        // Validate token logic would go here
        if ($token !== 'valid_token') {
            return $response->json(['error' => 'Invalid token'], 401);
        }
        
        return $next($request, $response);
    }
}

// Database connection
class Database {
    private static ?\\PDO $instance = null;
    
    public static function getInstance(): \\PDO {
        if (self::$instance === null) {
            $dsn = 'mysql:host=localhost;dbname=myapp;charset=utf8mb4';
            $username = 'user';
            $password = 'password';
            $options = [
                \\PDO::ATTR_ERRMODE => \\PDO::ERRMODE_EXCEPTION,
                \\PDO::ATTR_DEFAULT_FETCH_MODE => \\PDO::FETCH_ASSOC,
                \\PDO::ATTR_EMULATE_PREPARES => false,
            ];
            
            try {
                self::$instance = new \\PDO($dsn, $username, $password, $options);
            } catch (\\PDOException $e) {
                throw new \\Exception("Database connection failed: " . $e->getMessage());
            }
        }
        
        return self::$instance;
    }
}

// User model
class User {
    private ?int $id;
    private string $name;
    private string $email;
    
    public function __construct(?int $id = null, string $name = '', string $email = '') {
        $this->id = $id;
        $this->name = $name;
        $this->email = $email;
    }
    
    public static function find(int $id): ?self {
        $db = Database::getInstance();
        $stmt = $db->prepare('SELECT * FROM users WHERE id = ?');
        $stmt->execute([$id]);
        $user = $stmt->fetch();
        
        if (!$user) {
            return null;
        }
        
        return new self($user['id'], $user['name'], $user['email']);
    }
    
    public static function findAll(): array {
        $db = Database::getInstance();
        $stmt = $db->query('SELECT * FROM users');
        $users = [];
        
        foreach ($stmt->fetchAll() as $user) {
            $users[] = new self($user['id'], $user['name'], $user['email']);
        }
        
        return $users;
    }
    
    public function save(): bool {
        $db = Database::getInstance();
        
        if ($this->id) {
            // Update existing user
            $stmt = $db->prepare('UPDATE users SET name = ?, email = ? WHERE id = ?');
            return $stmt->execute([$this->name, $this->email, $this->id]);
        } else {
            // Create new user
            $stmt = $db->prepare('INSERT INTO users (name, email) VALUES (?, ?)');
            $result = $stmt->execute([$this->name, $this->email]);
            
            if ($result) {
                $this->id = (int) $db->lastInsertId();
            }
            
            return $result;
        }
    }
    
    public function delete(): bool {
        if (!$this->id) {
            return false;
        }
        
        $db = Database::getInstance();
        $stmt = $db->prepare('DELETE FROM users WHERE id = ?');
        return $stmt->execute([$this->id]);
    }
    
    public function toArray(): array {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email
        ];
    }
}

// Router
class Router {
    private array $routes = [];
    private array $middlewares = [];
    
    public function addMiddleware(Middleware $middleware): self {
        $this->middlewares[] = $middleware;
        return $this;
    }
    
    public function get(string $path, callable $handler): self {
        $this->routes['GET'][$path] = $handler;
        return $this;
    }
    
    public function post(string $path, callable $handler): self {
        $this->routes['POST'][$path] = $handler;
        return $this;
    }
    
    public function put(string $path, callable $handler): self {
        $this->routes['PUT'][$path] = $handler;
        return $this;
    }
    
    public function delete(string $path, callable $handler): self {
        $this->routes['DELETE'][$path] = $handler;
        return $this;
    }
    
    public function dispatch(Request $request, Response $response): void {
        $method = $request->getMethod();
        $uri = $request->getUri();
        
        // Find matching route
        foreach ($this->routes[$method] ?? [] as $path => $handler) {
            $pattern = $this->buildRoutePattern($path);
            if (preg_match($pattern, $uri, $matches)) {
                // Extract route params
                $params = array_filter($matches, function ($key) {
                    return !is_numeric($key);
                }, ARRAY_FILTER_USE_KEY);
                
                $request->setParams($params);
                
                // Execute middleware chain
                $this->executeMiddlewareChain(0, $request, $response, $handler);
                return;
            }
        }
        
        // No route found
        $response->notFound('Route not found');
    }
    
    private function executeMiddlewareChain(int $index, Request $request, Response $response, callable $handler): void {
        if ($index >= count($this->middlewares)) {
            // All middlewares passed, execute the handler
            $handler($request, $response);
            return;
        }
        
        $middleware = $this->middlewares[$index];
        $middleware->handle($request, $response, function ($req, $res) use ($index, $handler) {
            $this->executeMiddlewareChain($index + 1, $req, $res, $handler);
        });
    }
    
    private function buildRoutePattern(string $path): string {
        $pattern = preg_replace('/\\/:([^\\/]+)/', '/(?<$1>[^/]+)', $path);
        return "#^{$pattern}$#";
    }
}

// Create a new router
$router = new Router();

// Add authentication middleware for protected routes
$router->addMiddleware(new AuthMiddleware());

// Define routes
$router->get('/api/users', function (Request $request, Response $response) {
    $users = User::findAll();
    $response->json(['users' => array_map(fn($user) => $user->toArray(), $users)]);
});

$router->get('/api/users/:id', function (Request $request, Response $response) {
    $id = (int) $request->getParam('id');
    $user = User::find($id);
    
    if (!$user) {
        return $response->notFound('User not found');
    }
    
    $response->json(['user' => $user->toArray()]);
});

$router->post('/api/users', function (Request $request, Response $response) {
    $body = $request->getBody();
    
    if (empty($body['name']) || empty($body['email'])) {
        return $response->badRequest('Name and email are required');
    }
    
    $user = new User(null, $body['name'], $body['email']);
    
    if ($user->save()) {
        $response->json(['user' => $user->toArray()], 201);
    } else {
        $response->json(['error' => 'Failed to create user'], 500);
    }
});

// Dispatch the request
$request = new Request();
$response = new Response();
$router->dispatch($request, $response);
?>`
};