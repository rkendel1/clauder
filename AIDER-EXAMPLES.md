# Aider Example Tasks

This guide provides example tasks and templates to help you get started with Aider in the VS Code extension.

## 🚀 Quick Start Examples

### 1. Simple Code Creation
**Task:** "Create a new Python function to calculate fibonacci numbers"

**What Aider Will Do:**
- Create a new file (or modify existing)
- Add the fibonacci function
- Include proper documentation
- Add type hints if appropriate

**Example Output:**
```python
def fibonacci(n: int) -> int:
    """Calculate the nth Fibonacci number.
    
    Args:
        n: The position in the Fibonacci sequence
        
    Returns:
        The nth Fibonacci number
    """
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)
```

---

### 2. Refactoring Existing Code
**Task:** "Refactor the User class to use dataclasses instead of __init__"

**What Aider Will Do:**
- Locate the User class in your codebase
- Convert it to use Python's dataclass decorator
- Preserve all existing functionality
- Update any affected code

---

### 3. Bug Fixing
**Task:** "Fix the IndexError in the get_user_by_id function when the list is empty"

**What Aider Will Do:**
- Analyze the function
- Add proper bounds checking
- Include error handling
- Ensure edge cases are covered

---

### 4. Adding Tests
**Task:** "Add unit tests for the calculate_discount function"

**What Aider Will Do:**
- Create or update test file
- Add comprehensive test cases
- Include edge cases and error conditions
- Follow existing test patterns in your project

**Example Output:**
```python
import pytest
from your_module import calculate_discount

def test_calculate_discount_basic():
    assert calculate_discount(100, 0.1) == 90

def test_calculate_discount_no_discount():
    assert calculate_discount(100, 0) == 100

def test_calculate_discount_full_discount():
    assert calculate_discount(100, 1.0) == 0

def test_calculate_discount_invalid_percentage():
    with pytest.raises(ValueError):
        calculate_discount(100, 1.5)
```

---

### 5. API Integration
**Task:** "Add a new endpoint to fetch user profile data from the database"

**What Aider Will Do:**
- Create the endpoint handler
- Add database queries
- Include proper error handling
- Follow REST conventions

---

### 6. Documentation Updates
**Task:** "Add comprehensive docstrings to all functions in the utils.py file"

**What Aider Will Do:**
- Scan all functions in utils.py
- Add proper docstrings with Args, Returns, Raises
- Follow your project's documentation style
- Update any existing incomplete docs

---

## 💡 Best Practices for Aider Tasks

### Be Specific
❌ **Bad:** "Fix the code"  
✅ **Good:** "Fix the null pointer exception in the getUserData function when user is not found"

### Provide Context
❌ **Bad:** "Add validation"  
✅ **Good:** "Add email format validation to the user registration form using regex"

### Break Down Complex Tasks
❌ **Bad:** "Build a complete REST API with authentication, database, and frontend"  
✅ **Good:** 
1. "Create user authentication endpoints (login, register, logout)"
2. "Add JWT token generation and validation"
3. "Create protected routes middleware"

### Reference Files When Needed
✅ "Update the UserService class in src/services/user.service.ts to include password hashing"

---

## 🎯 Common Task Templates

### Adding a New Feature
```
Add a [feature name] that [description of functionality]:
- [Requirement 1]
- [Requirement 2]
- [Requirement 3]

Use [specific libraries/patterns] if applicable.
```

### Code Review and Improvement
```
Review and improve the [file/function name] by:
- Adding error handling
- Improving performance
- Adding type annotations
- Following [coding standard]
```

### Database/Model Changes
```
Update the [model name] to:
- Add field: [field name] of type [type]
- Add validation for [field]
- Create migration script
```

### Test Coverage
```
Increase test coverage for [module/file] by:
- Adding unit tests for [functions]
- Adding integration tests for [workflows]
- Testing edge cases for [scenarios]
```

---

## 🔧 Advanced Examples

### 1. Multi-File Refactoring
**Task:** "Refactor the authentication logic to use a separate AuthService class across login.ts, register.ts, and middleware.ts"

**What Happens:**
- Aider analyzes all three files
- Creates new AuthService class
- Updates all files to use the new service
- Maintains existing functionality

---

### 2. Architecture Changes
**Task:** "Convert the REST API to use GraphQL, keeping the same data models"

**What Happens:**
- Creates GraphQL schema from existing models
- Adds resolvers for queries and mutations
- Maintains backward compatibility where needed
- Updates documentation

---

### 3. Performance Optimization
**Task:** "Optimize the database query in getUsersWithOrders to reduce N+1 queries using eager loading"

**What Happens:**
- Analyzes current query patterns
- Implements proper joins/includes
- Adds database indexes if needed
- Verifies performance improvement

---

## 📝 Tips for Success

1. **Start Small**: Begin with simple tasks to understand how Aider works
2. **Review Changes**: Always review Aider's changes before committing
3. **Use Git**: Aider works best with git - it can show you diffs and make commits
4. **Iterate**: If the first attempt isn't perfect, refine your request
5. **Combine with Chat**: Use the chat to discuss approaches before implementing

---

## 🐛 Troubleshooting Task Examples

### When Aider Can't Find a File
**Instead of:** "Update the User model"  
**Try:** "Update the User model in src/models/user.ts"

### When Results Are Too Broad
**Instead of:** "Add validation"  
**Try:** "Add email validation to the signup form in src/components/SignupForm.tsx using yup schema"

### When You Need Specific Patterns
**Instead of:** "Create a service"  
**Try:** "Create a UserService following the repository pattern with methods for CRUD operations"

---

## 📚 Learning Resources

- Review the [AIDER.md](./AIDER.md) guide for configuration details
- Check Aider's official documentation at [aider.chat](https://aider.chat)
- Join our Discord for community support and examples

---

## 🎓 Progressive Learning Path

1. **Week 1**: Simple file creation and basic modifications
2. **Week 2**: Refactoring existing code and adding tests  
3. **Week 3**: Multi-file changes and bug fixes
4. **Week 4**: Architecture changes and complex features

Happy coding with Aider! 🚀
