import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

void main() => runApp(MaterialApp(home: SearchPage()));

class SearchPage extends StatefulWidget {
  @override
  _SearchPageState createState() => _SearchPageState();
}

class _SearchPageState extends State<SearchPage> {
  List results = [];

  // פונקציה שקוראת לשרת ה-Node.js שלנו
  Future<void> search(String query) async {
    if (query.trim().isEmpty) {
      setState(() => results = []);
      return;
    }
    final response = await http.get(Uri.parse('http://localhost:3000/search?q=$query'));
    if (response.statusCode == 200) {
      try {
        final decoded = json.decode(response.body);
        if (decoded is List) {
          setState(() => results = decoded);
        } else {
          setState(() => results = []);
        }
      } catch (e) {
        setState(() => results = []);
      }
    } else {
      setState(() => results = []);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text("Elastic Search App")),
      body: Column(
        children: [
          TextField(onChanged: (val) => search(val)), // חיפוש תוך כדי הקלדה
          Expanded(
            child: ListView.builder(
              itemCount: results.length,
              itemBuilder: (context, index) {
                final item = results[index];
                if (item is Map && item.containsKey('_source')) {
                  final source = item['_source'];
                  if (source is Map) {
                    return ListTile(
                      title: Text(source['name']?.toString() ?? 'No name'),
                      subtitle: Text(source['description']?.toString() ?? 'No description'),
                    );
                  }
                }
                return ListTile(title: Text('Invalid item'));
              },
            ),
          ),
        ],
      ),
    );
  }
}