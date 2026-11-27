import 'package:material_ui/material_ui.dart';

void main() {
  runApp(const RestoApp());
}

class RestoApp extends StatelessWidget {
  const RestoApp({super.key});

  @override
  Widget build(BuildContext context) {
    return const MaterialApp(
      title: 'Resto.az',
      home: Scaffold(
        body: SafeArea(child: Center(child: Text('Resto.az'))),
      ),
    );
  }
}
