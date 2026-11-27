import 'package:customer/main.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  testWidgets('Resto.az startup screen renders', (WidgetTester tester) async {
    await tester.pumpWidget(const RestoApp());

    expect(find.text('Resto.az'), findsOneWidget);
    expect(tester.takeException(), isNull);
  });
}
