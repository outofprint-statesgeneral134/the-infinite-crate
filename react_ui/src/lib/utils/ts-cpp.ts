/**
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Utility to convert TypeScript types to C++ types
 * Focusing on JSON-compatible types: string, number, boolean, arrays, and objects
 */

import * as ts from 'typescript';

/**
 * Convert a TypeScript type to its C++ equivalent
 * @param typeNode The TypeScript type node to convert
 * @param checker TypeChecker to resolve types
 * @param sourceFile Source file for context
 * @returns The equivalent C++ type as a string
 */
export function convertTSTypeToCpp(
  typeNode: ts.TypeNode | undefined,
  checker: ts.TypeChecker,
  sourceFile: ts.SourceFile,
): string {
  if (!typeNode) {
    return 'void'; // Default fallback
  }

  // Handle primitive types
  if (
    typeNode.kind === ts.SyntaxKind.StringKeyword ||
    typeNode.kind === ts.SyntaxKind.NumberKeyword ||
    typeNode.kind === ts.SyntaxKind.BooleanKeyword ||
    typeNode.kind === ts.SyntaxKind.NullKeyword ||
    typeNode.kind === ts.SyntaxKind.UndefinedKeyword
  ) {
    switch (typeNode.kind) {
      case ts.SyntaxKind.StringKeyword:
        return 'std::string';
      case ts.SyntaxKind.NumberKeyword:
        return 'double';
      case ts.SyntaxKind.BooleanKeyword:
        return 'bool';
      case ts.SyntaxKind.NullKeyword:
      case ts.SyntaxKind.UndefinedKeyword:
        return 'std::nullptr_t';
      default:
        return 'void'; // Unsupported primitive type
    }
  }

  // Handle array types
  if (ts.isArrayTypeNode(typeNode)) {
    const elementType = convertTSTypeToCpp(
      typeNode.elementType,
      checker,
      sourceFile,
    );
    return `std::vector<${elementType}>`;
  }

  // Handle type references (interfaces, type aliases, etc.)
  if (ts.isTypeReferenceNode(typeNode)) {
    const typeName = typeNode.typeName.getText(sourceFile);

    // Handle special cases like Array<T>
    if (typeName === 'Array') {
      if (typeNode.typeArguments && typeNode.typeArguments.length > 0) {
        const elementType = convertTSTypeToCpp(
          typeNode.typeArguments[0],
          checker,
          sourceFile,
        );
        return `std::vector<${elementType}>`;
      }
      return 'std::vector<void*>'; // Fallback for Array without type arguments
    }

    // Handle special cases like Record<K, V>
    if (typeName === 'Record' || typeName === 'Map') {
      if (typeNode.typeArguments && typeNode.typeArguments.length >= 2) {
        const keyType = convertTSTypeToCpp(
          typeNode.typeArguments[0],
          checker,
          sourceFile,
        );
        const valueType = convertTSTypeToCpp(
          typeNode.typeArguments[1],
          checker,
          sourceFile,
        );

        // For Record, we typically use string keys in JSON
        if (typeName === 'Record') {
          return `std::map<std::string, ${valueType}>`;
        }

        return `std::map<${keyType}, ${valueType}>`;
      }
      return 'std::map<std::string, void*>'; // Fallback
    }

    // For other type references, use the type name directly
    // In a full implementation, we would resolve the type and check if it's an interface
    return typeName;
  }

  // Handle literal types
  if (ts.isLiteralTypeNode(typeNode)) {
    const literal = typeNode.literal;
    if (ts.isStringLiteral(literal)) {
      return 'std::string';
    } else if (ts.isNumericLiteral(literal)) {
      return 'double';
    } else if (
      literal.kind === ts.SyntaxKind.TrueKeyword ||
      literal.kind === ts.SyntaxKind.FalseKeyword
    ) {
      return 'bool';
    }
  }

  // Handle union types (simplified - in a real implementation we'd need to handle this better)
  if (ts.isUnionTypeNode(typeNode)) {
    // For JSON compatibility, we'll use the most common approach:
    // Check if it's a nullable type (T | null | undefined)
    const nonNullableTypes = typeNode.types.filter(
      t =>
        t.kind !== ts.SyntaxKind.NullKeyword &&
        t.kind !== ts.SyntaxKind.UndefinedKeyword,
    );

    if (nonNullableTypes.length === 1) {
      // It's a nullable type, use std::optional
      const baseType = convertTSTypeToCpp(
        nonNullableTypes[0],
        checker,
        sourceFile,
      );
      return `std::optional<${baseType}>`;
    }

    // For other unions, we'd need a more sophisticated approach
    // For now, just use a variant if there are a few types
    if (typeNode.types.length <= 4) {
      const variantTypes = typeNode.types
        .map(t => convertTSTypeToCpp(t, checker, sourceFile))
        .join(', ');
      return `std::variant<${variantTypes}>`;
    }

    // Fallback for complex unions
    return 'nlohmann::json';
  }

  // Handle object types (inline object literals)
  if (ts.isTypeLiteralNode(typeNode)) {
    // For inline objects, we'd ideally generate an anonymous struct
    // But for simplicity, we'll just use a generic JSON object type
    return 'nlohmann::json';
  }

  // Fallback for unsupported types
  return 'nlohmann::json';
}
